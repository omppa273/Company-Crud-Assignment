const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Employee = sequelize.define('Employee', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'companies',
            key: 'id'
        }
    },
    empName: {
        type: DataTypes.STRING(25),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 25]
        }
    },
    designation: {
        type: DataTypes.ENUM('Developer', 'Manager', 'System Admin', 'Team Lead', 'PM'),
        allowNull: false
    },
    joinDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true,
            isBefore: new Date().toISOString().split('T')[0] // Only past dates
        }
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
    tableName: 'employees',
    timestamps: true
});

module.exports = Employee;