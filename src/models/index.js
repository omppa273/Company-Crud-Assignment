// src/models/index.js
const { sequelize } = require('../config/database');
const Company = require('./company');
const Employee = require('./employee');
const Skill = require('./skill');
const EmployeeSkill = require('./EmployeeSkill');
const Education = require('./Education');

// Define associations
Company.hasMany(Employee, {
    foreignKey: 'companyId',
    as: 'empInfo',
    onDelete: 'CASCADE'
});

Employee.belongsTo(Company, {
    foreignKey: 'companyId',
    as: 'company'
});

Employee.hasMany(Education, {
    foreignKey: 'employeeId',
    as: 'educationInfo',
    onDelete: 'CASCADE'
});

Education.belongsTo(Employee, {
    foreignKey: 'employeeId',
    as: 'employee'
});

Employee.belongsToMany(Skill, {
    through: EmployeeSkill,
    foreignKey: 'employeeId',
    otherKey: 'skillId',
    as: 'skillInfo'
});

Skill.belongsToMany(Employee, {
    through: EmployeeSkill,
    foreignKey: 'skillId',
    otherKey: 'employeeId',
    as: 'employees'
});

module.exports = {
    sequelize,
    Company,
    Employee,
    Skill,
    EmployeeSkill,
    Education
};
