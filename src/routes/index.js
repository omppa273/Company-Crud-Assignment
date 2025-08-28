const express = require('express');
const router = express.Router();
const companyRoutes = require('./companyRoutes');
const masterRoutes = require('./masterRoutes');

// Company routes
router.use('/companies', companyRoutes);

// Master data routes
router.use('/master', masterRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;