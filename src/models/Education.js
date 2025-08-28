// src/models/Education.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Education = sequelize.define('Education', {
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
    instituteName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50]
        }
    },
    courseName: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 25]
        }
    },
    completedYear: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            is: /^[A-Za-z]{3} \d{4}$/ // Format: "Mar 2021"
        }
    }
}, {
    tableName: 'education',
    timestamps: true
});

module.exports = Education;