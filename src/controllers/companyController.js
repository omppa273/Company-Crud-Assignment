// src/controllers/companyController.js
const { Company, Employee, Skill, EmployeeSkill, Education, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { validationResult } = require('express-validator');

class CompanyController {
    // GET /api/companies - List all companies
    static async getAllCompanies(req, res) {
        try {
            const companies = await Company.findAll({
                attributes: ['id', 'companyName', 'email', 'phoneNumber', 'createdAt'],
                order: [['createdAt', 'DESC']]
            });

            return successResponse(res, companies, 'Companies retrieved successfully');
        } catch (error) {
            console.error('Error fetching companies:', error);
            return errorResponse(res, 'Failed to fetch companies', 500);
        }
    }

    // GET /api/companies/:id - Get company with employees
    static async getCompanyById(req, res) {
        try {
            const { id } = req.params;

            const company = await Company.findByPk(id, {
                include: [
                    {
                        model: Employee,
                        as: 'empInfo',
                        include: [
                            {
                                model: Skill,
                                as: 'skillInfo',
                                through: {
                                    attributes: ['skillRating']
                                }
                            },
                            {
                                model: Education,
                                as: 'educationInfo'
                            }
                        ]
                    }
                ]
            });

            if (!company) {
                return errorResponse(res, 'Company not found', 404);
            }

            // Format the response to match the required JSON structure
            const formattedCompany = {
                id: company.id,
                companyName: company.companyName,
                address: company.address,
                email: company.email,
                phoneNumber: company.phoneNumber,
                empInfo: company.empInfo.map(emp => ({
                    id: emp.id,
                    empName: emp.empName,
                    designation: emp.designation,
                    joinDate: emp.joinDate,
                    email: emp.email,
                    phoneNumber: emp.phoneNumber,
                    skillInfo: emp.skillInfo.map(skill => ({
                        skillName: skill.skillName,
                        skillRating: skill.EmployeeSkill.skillRating
                    })),
                    educationInfo: emp.educationInfo.map(edu => ({
                        instituteName: edu.instituteName,
                        courseName: edu.courseName,
                        completedYear: edu.completedYear
                    }))
                }))
            };

            return successResponse(res, formattedCompany, 'Company retrieved successfully');
        } catch (error) {
            console.error('Error fetching company:', error);
            return errorResponse(res, 'Failed to fetch company', 500);
        }
    }

    // POST /api/companies - Create new company
    static async createCompany(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                await transaction.rollback();
                return errorResponse(res, 'Validation failed', 400, errors.array());
            }

            const { companyName, address, email, phoneNumber, empInfo } = req.body;

            // Create company
            const company = await Company.create({
                companyName,
                address,
                email,
                phoneNumber
            }, { transaction });

            // Create employees if provided
            if (empInfo && empInfo.length > 0) {
                for (const empData of empInfo) {
                    // Create employee
                    const employee = await Employee.create({
                        companyId: company.id,
                        empName: empData.empName,
                        designation: empData.designation,
                        joinDate: empData.joinDate,
                        email: empData.email,
                        phoneNumber: empData.phoneNumber
                    }, { transaction });

                    // Create employee skills
                    if (empData.skillInfo && empData.skillInfo.length > 0) {
                        for (const skillData of empData.skillInfo) {
                            const skill = await Skill.findOne({
                                where: { skillName: skillData.skillName }
                            });

                            if (skill) {
                                await EmployeeSkill.create({
                                    employeeId: employee.id,
                                    skillId: skill.id,
                                    skillRating: skillData.skillRating
                                }, { transaction });
                            }
                        }
                    }

                    // Create employee education
                    if (empData.educationInfo && empData.educationInfo.length > 0) {
                        for (const eduData of empData.educationInfo) {
                            await Education.create({
                                employeeId: employee.id,
                                instituteName: eduData.instituteName,
                                courseName: eduData.courseName,
                                completedYear: eduData.completedYear
                            }, { transaction });
                        }
                    }
                }
            }

            await transaction.commit();
            
            return successResponse(res, 
                { id: company.id, companyName: company.companyName }, 
                'Company details saved successfully', 
                201
            );

        } catch (error) {
            await transaction.rollback();
            console.error('Error creating company:', error);
            
            if (error.name === 'SequelizeValidationError') {
                return errorResponse(res, 'Validation error', 400, error.errors);
            }
            
            return errorResponse(res, 'Failed to create company', 500);
        }
    }

    // PUT /api/companies/:id - Update company
    static async updateCompany(req, res) {
        const transaction = await sequelize.transaction();
        
        try {
            const { id } = req.params;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                await transaction.rollback();
                return errorResponse(res, 'Validation failed', 400, errors.array());
            }

            const company = await Company.findByPk(id);
            if (!company) {
                await transaction.rollback();
                return errorResponse(res, 'Company not found', 404);
            }

            const { companyName, address, email, phoneNumber, empInfo } = req.body;

            // Update company
            await company.update({
                companyName,
                address,
                email,
                phoneNumber
            }, { transaction });

            // Delete existing employees and related data
            await Employee.destroy({
                where: { companyId: id },
                transaction
            });

            // Create new employees
            if (empInfo && empInfo.length > 0) {
                for (const empData of empInfo) {
                    const employee = await Employee.create({
                        companyId: company.id,
                        empName: empData.empName,
                        designation: empData.designation,
                        joinDate: empData.joinDate,
                        email: empData.email,
                        phoneNumber: empData.phoneNumber
                    }, { transaction });

                    // Create skills
                    if (empData.skillInfo && empData.skillInfo.length > 0) {
                        for (const skillData of empData.skillInfo) {
                            const skill = await Skill.findOne({
                                where: { skillName: skillData.skillName }
                            });

                            if (skill) {
                                await EmployeeSkill.create({
                                    employeeId: employee.id,
                                    skillId: skill.id,
                                    skillRating: skillData.skillRating
                                }, { transaction });
                            }
                        }
                    }

                    // Create education
                    if (empData.educationInfo && empData.educationInfo.length > 0) {
                        for (const eduData of empData.educationInfo) {
                            await Education.create({
                                employeeId: employee.id,
                                instituteName: eduData.instituteName,
                                courseName: eduData.courseName,
                                completedYear: eduData.completedYear
                            }, { transaction });
                        }
                    }
                }
            }

            await transaction.commit();
            
            return successResponse(res, 
                { id: company.id, companyName: company.companyName }, 
                'Company updated successfully'
            );

        } catch (error) {
            await transaction.rollback();
            console.error('Error updating company:', error);
            return errorResponse(res, 'Failed to update company', 500);
        }
    }

    // DELETE /api/companies/:id - Delete company
    static async deleteCompany(req, res) {
        try {
            const { id } = req.params;

            const company = await Company.findByPk(id);
            if (!company) {
                return errorResponse(res, 'Company not found', 404);
            }

            await company.destroy();
            
            return successResponse(res, null, 'Company deleted successfully');

        } catch (error) {
            console.error('Error deleting company:', error);
            return errorResponse(res, 'Failed to delete company', 500);
        }
    }
}

module.exports = CompanyController;