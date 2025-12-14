const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: 'Search query required' });
        }
        const result = await pool.query(
            `SELECT 
                a.id, a.title, a.body, a.created_at,
                u.username as author_name,
                c.name as category_name,
                ts_rank(a.search_vector, plainto_tsquery('english', $1)) as rank
             FROM articles a
             LEFT JOIN users u ON a.author_id = u.id
             LEFT JOIN categories c ON a.category_id = c.id
             WHERE a.search_vector @@ plainto_tsquery('english', $1)
             ORDER BY rank DESC LIMIT 20`,
            [q]
        );
        res.json({ query: q, results: result.rows, count: result.rows.length });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;