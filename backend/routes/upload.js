const express = require('express');
const router = express.Router();

// Placeholder for upload functionality
router.post('/', (req, res) => {
    res.status(501).json({ message: 'Upload functionality not implemented yet' });
});

module.exports = router;
