const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth } = require('../middleware/auth');

// Get comments for an article
router.get('/:articleId', async (req, res) => {
    try {
        const { articleId } = req.params;
        const result = await pool.query(
            `SELECT c.id, c.content as body, c.created_at, u.username as user_name, c.user_id
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.article_id = $1
             ORDER BY c.created_at DESC`,
            [articleId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add a comment
router.post('/:articleId', auth, async (req, res) => {
    try {
        const { articleId } = req.params;
        const { body } = req.body;
        
        console.log(`📝 Posting comment for article ${articleId} by user ${req.user.id}`);

        if (!body || !body.trim()) {
            return res.status(400).json({ error: 'Comment body required' });
        }

        const result = await pool.query(
            `INSERT INTO comments (article_id, user_id, content)
             VALUES ($1, $2, $3)
             RETURNING id, content as body, created_at`,
            [articleId, req.user.id, body]
        );

        const newComment = result.rows[0];
        
        // Add user info to response
        newComment.user_name = req.user.username;
        
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete a comment
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check ownership or admin role
        const comment = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
        
        if (comment.rows.length === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.rows[0].user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await pool.query('DELETE FROM comments WHERE id = $1', [id]);
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
