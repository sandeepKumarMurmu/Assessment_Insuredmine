const multer = require('multer');
const path = require('path');
const fs = require('fs/promises');


// Importing function/methodes
const { randomString } = require("../utils/helperFile");


/**
 * A file filter function for Multer that dynamically checks the file type based on allowed MIME types.
 * 
 * @param {Object} req - The request object.
 * @param {Object} file - The file object that contains information about the uploaded file.
 * @param {Function} cb - A callback function to signal whether the file should be accepted or rejected.
 * @param {Array<string>} allowedTypes - An array of allowed MIME types for file uploads.
 */
function fileFilter(req, file, cb, allowedTypes) {
    // Check if the file's MIME type is included in the allowed MIME types array.
    if (allowedTypes.includes(file.mimetype)) {
        // If the file type is allowed, pass 'null' for the error and 'true' to accept the file.
        cb(null, true);
    } else {
        // If the file type is not allowed, pass an error message to reject the file.
        cb(new Error(`Invalid file type. Only the following types are allowed: ${allowedTypes.join(', ')}.`));
    }
}

/**
 * Creates a multer instance with a specified upload destination.
 * 
 * @param {string} dest - The destination path where files will be stored.
 * @returns {multer.Instance} - A configured multer instance for file uploads.
 */
function createMulterInstance(dest, allowedTypes) {
    // Define storage configuration for multer
    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            try {
                // Ensure the directory exists, create it if it doesn't
                await fs.mkdir(dest, { recursive: true });
                cb(null, dest);
            } catch (error) {
                cb(new Error(`Failed to create directory: ${error.message}`));
            }
        },
        filename: (req, file, cb) => {
            // Save the file with its original name
            cb(null, randomString(10) + "_" + Date.now() + path.extname(file.originalname));
        }
    });

    // Return the configured multer instance
    return multer({
        storage,
        fileFilter: (req, file, cb) => fileFilter(req, file, cb, allowedTypes)
    });
}

// Export the functions so they can be used in other parts of the application.
module.exports = {
    createMulterInstance
};

