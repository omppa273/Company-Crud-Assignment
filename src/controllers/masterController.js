// src/controllers/masterController.js
const { Skill } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { DESIGNATIONS } = require('../utils/constants');

class MasterController {
    // GET /api/master/skills - Get all skills
    static async getSkills(req, res) {
        try {
            const skills = await Skill.findAll({
                where: { isActive: true },
                attributes: ['id', 'skillName'],
                order: [['skillName', 'ASC']]
            });

            return successResponse(res, skills, 'Skills retrieved successfully');
        } catch (error) {
            console.error('Error fetching skills:', error);
            return errorResponse(res, 'Failed to fetch skills', 500);
        }
    }

    // GET /api/master/designations - Get all designations
    static async getDesignations(req, res) {
        try {
            return successResponse(res, DESIGNATIONS, 'Designations retrieved successfully');
        } catch (error) {
            console.error('Error fetching designations:', error);
            return errorResponse(res, 'Failed to fetch designations', 500);
        }
    }
}

module.exports = MasterController;