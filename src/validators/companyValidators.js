// src/validators/companyValidator.js
const { body } = require('express-validator');

const companyValidationRules = () => {
    return [
        // Company basic info validation
        body('companyName')
            .trim()
            .notEmpty()
            .withMessage('Company name is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Company name must be between 1 and 50 characters'),
            
        body('address')
            .optional()
            .trim(),
            
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .isLength({ max: 100 })
            .withMessage('Email must not exceed 100 characters'),
            
        body('phoneNumber')
            .trim()
            .notEmpty()
            .withMessage('Phone number is required')
            .isLength({ min: 1, max: 15 })
            .withMessage('Phone number must be between 1 and 15 characters'),

        // Employee info validation
        body('empInfo')
            .optional()
            .isArray()
            .withMessage('Employee info must be an array'),

        body('empInfo.*.empName')
            .if(body('empInfo').exists())
            .trim()
            .notEmpty()
            .withMessage('Employee name is required')
            .isLength({ min: 1, max: 25 })
            .withMessage('Employee name must be between 1 and 25 characters'),

        body('empInfo.*.designation')
            .if(body('empInfo').exists())
            .notEmpty()
            .withMessage('Designation is required')
            .isIn(['Developer', 'Manager', 'System Admin', 'Team Lead', 'PM'])
            .withMessage('Invalid designation'),

        body('empInfo.*.joinDate')
            .if(body('empInfo').exists())
            .notEmpty()
            .withMessage('Join date is required')
            .isDate()
            .withMessage('Join date must be a valid date')
            .custom((value) => {
                if (new Date(value) >= new Date()) {
                    throw new Error('Join date must be in the past');
                }
                return true;
            }),

        body('empInfo.*.email')
            .if(body('empInfo').exists())
            .trim()
            .notEmpty()
            .withMessage('Employee email is required')
            .isEmail()
            .withMessage('Please provide a valid employee email')
            .isLength({ max: 100 })
            .withMessage('Employee email must not exceed 100 characters'),

        body('empInfo.*.phoneNumber')
            .if(body('empInfo').exists())
            .trim()
            .notEmpty()
            .withMessage('Employee phone number is required')
            .isLength({ min: 1, max: 15 })
            .withMessage('Employee phone number must be between 1 and 15 characters'),

        // Skills validation
        body('empInfo.*.skillInfo')
            .if(body('empInfo').exists())
            .optional()
            .isArray()
            .withMessage('Skill info must be an array'),

        body('empInfo.*.skillInfo.*.skillName')
            .if(body('empInfo.*.skillInfo').exists())
            .notEmpty()
            .withMessage('Skill name is required'),

        body('empInfo.*.skillInfo.*.skillRating')
            .if(body('empInfo.*.skillInfo').exists())
            .notEmpty()
            .withMessage('Skill rating is required')
            .isInt({ min: 1, max: 5 })
            .withMessage('Skill rating must be between 1 and 5'),

        // Education validation
        body('empInfo.*.educationInfo')
            .if(body('empInfo').exists())
            .optional()
            .isArray()
            .withMessage('Education info must be an array'),

        body('empInfo.*.educationInfo.*.instituteName')
            .if(body('empInfo.*.educationInfo').exists())
            .trim()
            .notEmpty()
            .withMessage('Institute name is required')
            .isLength({ min: 1, max: 50 })
            .withMessage('Institute name must be between 1 and 50 characters'),

        body('empInfo.*.educationInfo.*.courseName')
            .if(body('empInfo.*.educationInfo').exists())
            .trim()
            .notEmpty()
            .withMessage('Course name is required')
            .isLength({ min: 1, max: 25 })
            .withMessage('Course name must be between 1 and 25 characters'),

        body('empInfo.*.educationInfo.*.completedYear')
            .if(body('empInfo.*.educationInfo').exists())
            .trim()
            .notEmpty()
            .withMessage('Completed year is required')
            .matches(/^[A-Za-z]{3} \d{4}$/)
            .withMessage('Completed year must be in format "Mar 2021"')
    ];
};

module.exports = {
    companyValidationRules
};
