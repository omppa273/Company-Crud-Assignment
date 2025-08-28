const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const EmployeeSkill = sequelize.define('EmployeeSkill', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    employeeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employees',
            key: 'id'
        }
    },
    skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'skills',
            key: 'id'
        }
    },
    skillRating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5,
            isInt: true
        }
    }
}, {
    tableName: 'employee_skills',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['employeeId', 'skillId']
        }
    ]
});

module.exports = EmployeeSkill;