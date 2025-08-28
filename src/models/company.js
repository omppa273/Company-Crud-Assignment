// src/models/Company.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50]
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true,
            len: [1, 100]
        }
    },
    phoneNumber: {
        type: DataTypes.STRING(15),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 15]
        }
    }
}, {
    tableName: 'companies',
    timestamps: true
});

module.exports = Company;