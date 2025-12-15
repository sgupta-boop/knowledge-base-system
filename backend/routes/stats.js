const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth: authenticateToken } = require('../middleware/auth');

// Get admin stats
router.get('/', authenticateToken, async (req, res) => {
    try {
        const globalStatsQuery = `
            SELECT 
                (SELECT COUNT(*) FROM articles) as total_articles,
                (SELECT COALESCE(SUM(view_count), 0) FROM articles) as total_views,
                (SELECT COUNT(*) FROM users WHERE last_seen > NOW() - INTERVAL '5 minutes') as active_users
        `;
        const globalStats = await pool.query(globalStatsQuery);

        const categoryStatsQuery = `
            SELECT 
                c.id, 
                c.name, 
                c.description,
                COUNT(a.id) as article_count,
                COALESCE(SUM(a.view_count), 0) as total_views
            FROM categories c
            LEFT JOIN articles a ON c.id = a.category_id
            GROUP BY c.id
            ORDER BY article_count DESC
        `;
        const categoryStats = await pool.query(categoryStatsQuery);

        res.json({
            global: globalStats.rows[0],
            categories: categoryStats.rows
        });

    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
