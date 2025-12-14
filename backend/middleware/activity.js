const pool = require('../config/db');

const trackActivity = async (req, res, next) => {
    if (req.user && req.user.id) {
        try {
            await pool.query('UPDATE users SET last_seen = NOW() WHERE id = $1', [req.user.id]);
        } catch (err) {
            console.error('Error tracking activity:', err);
        }
    }
    next();
};

module.exports = trackActivity;
