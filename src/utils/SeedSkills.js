// src/utils/seedSkills.js
const { Skill } = require('../models');
const { SKILLS_LIST } = require('./constants');

const seedSkills = async () => {
    try {
        console.log('🌱 Seeding skills...');
        
        for (const skillName of SKILLS_LIST) {
            await Skill.findOrCreate({
                where: { skillName },
                defaults: { skillName, isActive: true }
            });
        }
        
        console.log('✅ Skills seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding skills:', error.message);
    }
};

module.exports = { seedSkills };