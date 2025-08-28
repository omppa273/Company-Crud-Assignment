const express = require('express');
const router = express.Router();
const MasterController = require('../controllers/masterController');

// GET /api/master/skills - Get all skills
router.get('/skills', MasterController.getSkills);

// GET /api/master/designations - Get all designations
router.get('/designations', MasterController.getDesignations);

module.exports = router;