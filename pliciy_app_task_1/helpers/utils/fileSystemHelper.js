// Import the 'fs/promises' module, which provides promise-based versions of the filesystem (fs) functions.
const fs = require('fs/promises');

/**
 * Checks whether a file or folder exists at the given path.
 * 
 * @param {string} path - The path of the file or folder to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the file/folder exists, and false if it does not.
 * 
 * The function uses fs.access to check the existence of the file/folder. If the file or folder is found,
 * the promise resolves with true. If the file/folder is not found, an error with code 'ENOENT' is thrown, 
 * and the function catches this to return false.
 */
async function checkFileOrFolderExists(path) {
    try {
        // Attempt to access the file/folder at the specified path.
        await fs.access(path);
        return true;  // The file/folder exists
    } catch (error) {
        if (error.code === 'ENOENT') {
            // If the error code is 'ENOENT', it means the file/folder does not exist.
            return false;
        } else {
            // If a different error occurs, rethrow the error or handle it accordingly.
            throw new Error(`Unable to check if file or folder exists: ${error.message}`);
        }
    }
}

/**
 * Creates a new folder at the specified path.
 * 
 * @param {string} path - The path where the new folder should be created.
 * @returns {Promise<boolean>} - A promise that resolves to true if the folder was created successfully 
 *                               or if it already exists.
 * 
 * The function uses fs.mkdir to attempt to create a folder. If the folder already exists, 
 * an error with code 'EEXIST' is thrown, which is caught and returns true, indicating that 
 * the folder is present. If another error occurs, it is rethrown for further handling.
 */
async function createFolder(path) {
    try {
        // Attempt to create a directory at the specified path.
        await fs.mkdir(path);
        return true; // The folder was created successfully.
    } catch (error) {
        if (error.code === 'EEXIST') {
            // If the error code is 'EEXIST', it means the folder already exists.
            return true; // Return true, indicating the folder is present.
        } else {
            // For other errors, rethrow the error or handle it as necessary.
            throw new Error(`Unable to create file or folder: ${error.message}`);
        }
    }
}


/**
 * Deletes a file specified by the filePath.
 * 
 * This asynchronous function uses the `fs.promises.unlink` method to attempt to delete
 * the file. If the file is successfully deleted, it returns `true`. If an error occurs,
 * it throws a new `Error` with a descriptive message.
 * 
 * @param {string} filePath - The path to the file to be deleted.
 * @returns {Promise<boolean>} - Resolves to `true` if the file is successfully deleted.
 * @throws {Error} - Throws an error if the file cannot be deleted, with a message describing the issue.
 */
async function deleteFile(filePath) {
    try {
        // Attempt to delete the file specified by `filePath`.
        // `fs.promises.unlink` is an asynchronous operation that returns a promise.
        await fs.unlink(filePath);
        
        // If the file deletion was successful, return `true`.
        return true;
    } catch (error) {
        // If an error occurs during the file deletion, catch it.
        // Create and throw a new `Error` with a descriptive message including the original error's message.
        throw new Error(`Unable to remove file or folder: ${error.message}`);
    }
}

// Export the functions so they can be used in other parts of the application.
module.exports = {
    checkFileOrFolderExists,
    createFolder,
    deleteFile
};
