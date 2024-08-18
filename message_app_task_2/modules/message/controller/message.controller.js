const { body } = require('express-validator');

const { handleValidationErrors } = require("../../../middleWare/validateionMiddleware");
const { messageCreationService, listMessageWithPagination } = require("../service/message.service");


// Controller function for creating message
// Input: Request object (req), Response object (res), and optionally pagination parameters in the request
// Output: JSON response with message
const messageCreatrionController = [
    // Validation for 'message' field
    body('message')
        // Check if 'message' field exists
        .exists().withMessage('Message is required.')
        .bail() // Stop validation if this check fails
        // Check if 'message' contains at least 1 character
        .isLength({ min: 1 }).withMessage('Message should contain at least 1 character.')
        .bail() // Stop validation if this check fails
        // Validate 'message' to only contain allowed characters
        .matches(/^[a-zA-Z0-9.! ,]*$/).withMessage('Message can only contain alphanumeric characters, and ". ! ,".'),
    
    // Validation for 'date' field
    body('date')
        // Check if 'date' field exists and is not falsy
        .exists({ checkFalsy: true }).withMessage('Date field is mandatory')
        .bail()
        // Check if 'date' is a string
        .isString().withMessage('Date must be a string')
        .bail()
        // Validate 'date' format to be dd/mm/yyyy
        .matches(/^\d{2}\/\d{2}\/\d{4}$/).withMessage('Date must be in the format dd/mm/yyyy')
        .bail()
        // Custom validation for 'date' to check for valid day, month, and year
        .custom(value => {
            const [day, month, year] = value.split('/').map(Number);
            if (day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2024) {
                return false;
            }
            return true;
        }),
    
    // Validation for 'time' field
    body('time')
        // Check if 'time' field exists
        .exists().withMessage('Time is required.')
        .bail() // Stop validation if this check fails
        // Check if 'time' is a string
        .isString().withMessage('Time must be a string.')
        .bail() // Stop validation if this check fails
        // Validate 'time' format to be hh:mm:ss
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Time must be in the format hh:mm:ss.')
        .bail(), // Stop validation if this check fails
    
    // Middleware to handle validation errors
    handleValidationErrors,

    // Service to handle the creation of messages
    messageCreationService
];



// Controller function for listing messages with pagination
// Input: Request object (req), Response object (res), and optionally pagination parameters in the request
// Output: JSON response with paginated list of messages
const listAllMessagesController = [
    listMessageWithPagination // Function to handle listing messages with pagination
];


module.exports = {
    messageCreatrionController,
    listAllMessagesController
};