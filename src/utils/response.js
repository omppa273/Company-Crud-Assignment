// src/utils/response.js
const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    });
};

const validationErrorResponse = (res, errors) => {
    const formattedErrors = errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
    }));
    
    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formattedErrors,
        timestamp: new Date().toISOString()
    });
};

module.exports = {
    successResponse,
    errorResponse,
    validationErrorResponse
};
