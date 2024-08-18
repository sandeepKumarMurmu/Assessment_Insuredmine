const { validationResult } = require('express-validator');

const { mainApiResponse } = require("../helpers/response/apiResponse");

/**
 * Middleware to handle validation results.
 * It processes the errors from express-validator and sends a response if there are validation errors.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return mainApiResponse(res, 400, "failed", 'Body validation failed.', []);
    }
    next();
};

module.exports = {
    handleValidationErrors,
};
