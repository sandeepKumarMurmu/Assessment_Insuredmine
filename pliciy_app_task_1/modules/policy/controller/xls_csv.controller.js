const { body,param } = require('express-validator');

// const uploadFileService = require('../service/uploadFile.service');
const { createMulterInstance } = require('../../../helpers/uploadUtils/murterUtils');
const { extractDataFromUploadedFile, dataPreparationAndInsertionService, handelUploadedFileWithWorker, findPloicyByuserName } = require("../service/xls_csv.service");
const { handleValidationErrors } = require("../../../middleware/validateionMiddleware");


const ALLOWED_FILE_TYPES = [
    'application/vnd.ms-excel',       // For XLS files
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // For XLSX files
    'text/csv'                         // For CSV files
];
const DESTINATION_DIRECTORY = 'uploads';

const handelUploadedFileController = [
    createMulterInstance(DESTINATION_DIRECTORY, ALLOWED_FILE_TYPES).single('file'),
    handelUploadedFileWithWorker, //to run through worker thread
    // extractDataFromUploadedFile, //to run without worker thread
    // dataPreparationAndInsertionService, //to run without worker thread
];


const getUserByUserName = [
    param('userName') // Replace 'paramName' with the actual parameter name
        .notEmpty().withMessage('This field is required').bail() // Check if the parameter is present and not empty
        .isAlphanumeric().withMessage('This field must be alphanumeric'), // Check if the parameter is alphanumeric
    handleValidationErrors,
    findPloicyByuserName
];

// exporting the functions to be used in other parts of the application
module.exports = {
    handelUploadedFileController,
    getUserByUserName
};