const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const { companyValidationRules } = require('../validators/companyValidators');

// GET /api/companies - List all companies
router.get('/', CompanyController.getAllCompanies);

// GET /api/companies/:id - Get company by ID
router.get('/:id', CompanyController.getCompanyById);

// POST /api/companies - Create new company
router.post('/', companyValidationRules(), CompanyController.createCompany);

// PUT /api/companies/:id - Update company
router.put('/:id', companyValidationRules(), CompanyController.updateCompany);

// DELETE /api/companies/:id - Delete company
router.delete('/:id', CompanyController.deleteCompany);

module.exports = router;