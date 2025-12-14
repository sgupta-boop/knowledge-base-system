const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, checkRole } = require('../middleware/auth');

// Get all articles
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const categoryId = req.query.category;
        
        let query = `
            SELECT a.*, u.username as author_name, c.name as category_name,
                   COUNT(*) OVER() as total_count
            FROM articles a
            LEFT JOIN users u ON a.author_id = u.id
            LEFT JOIN categories c ON a.category_id = c.id
            WHERE 1=1
        `;
        const params = [];
        if (categoryId) {
            params.push(categoryId);
            query += ` AND a.category_id = $${params.length}`;
        }
        query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        
        const result = await pool.query(query, params);
        const totalCount = result.rows[0]?.total_count || 0;
        const totalPages = Math.ceil(totalCount / limit);
        
        res.json({
            articles: result.rows,
            pagination: {
                currentPage: page,
                totalPages,
                totalCount: parseInt(totalCount),
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (error) {
        console.error('Get articles error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single article
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT a.*, u.username as author_name, u.email as author_email,
                    c.name as category_name
             FROM articles a
             LEFT JOIN users u ON a.author_id = u.id
             LEFT JOIN categories c ON a.category_id = c.id
             WHERE a.id = $1`,
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        await pool.query('UPDATE articles SET view_count = view_count + 1 WHERE id = $1', [id]);
        const tagsResult = await pool.query(
            `SELECT t.id, t.name FROM tags t
             JOIN article_tags at ON t.id = at.tag_id
             WHERE at.article_id = $1`,
            [id]
        );
        const article = result.rows[0];
        article.tags = tagsResult.rows;
        res.json(article);
    } catch (error) {
        console.error('Get article error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create article
router.post('/', auth, checkRole('editor', 'admin'), async (req, res) => {
    const { title, body, category_id, status, tags } = req.body;
    try {
        if (!title || !body) {
            return res.status(400).json({ error: 'Title and body required' });
        }
        const result = await pool.query(
            `INSERT INTO articles (title, body, author_id, category_id, status)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, body, req.user.id, category_id, status || 'draft']
        );
        const article = result.rows[0];
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                const tagResult = await pool.query(
                    'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
                    [tagName.toLowerCase()]
                );
                await pool.query(
                    'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
                    [article.id, tagResult.rows[0].id]
                );
            }
        }
        res.status(201).json(article);
    } catch (error) {
        console.error('Create article error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update article
router.put('/:id', auth, checkRole('editor', 'admin'), async (req, res) => {
    const { id } = req.params;
    const { title, body, category_id, status, tags } = req.body;
    try {
        const existingArticle = await pool.query('SELECT * FROM articles WHERE id = $1', [id]);
        if (existingArticle.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        const oldArticle = existingArticle.rows[0];
        if (oldArticle.author_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }
        await pool.query(
            'INSERT INTO versions (article_id, title, body, edited_by) VALUES ($1, $2, $3, $4)',
            [id, oldArticle.title, oldArticle.body, req.user.id]
        );
        const result = await pool.query(
            `UPDATE articles 
             SET title = $1, body = $2, category_id = $3, status = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 RETURNING *`,
            [title, body, category_id, status, id]
        );
        if (tags) {
            await pool.query('DELETE FROM article_tags WHERE article_id = $1', [id]);
            for (const tagName of tags) {
                const tagResult = await pool.query(
                    'INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = $1 RETURNING id',
                    [tagName.toLowerCase()]
                );
                await pool.query(
                    'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)',
                    [id, tagResult.rows[0].id]
                );
            }
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Update article error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete article
router.delete('/:id', auth, checkRole('admin'), async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM articles WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json({ message: 'Article deleted successfully' });
    } catch (error) {
        console.error('Delete article error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get versions
router.get('/:id/versions', auth, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT v.*, u.username as edited_by_name
             FROM versions v
             LEFT JOIN users u ON v.edited_by = u.id
             WHERE v.article_id = $1
             ORDER BY v.created_at DESC`,
            [id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get versions error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;