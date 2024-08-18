
// importing functions/methodes
const { mainApiResponse } = require("../../../helpers/response/apiResponse");
const messageModel = require("../../../models/messageModel");

/**
 * Service to handle the creation of a message.
 * @param {Object} req - The request object containing the message data in `req.body`.
 * @param {Object} res - The response object used to send the API response.
 * @param {Function} next - The next middleware function in the Express stack.
 * @returns {Promise<void>} - Sends a response to the client.
 */
async function messageCreationService(req, res, next) {
    try {
        // Call the messageCreation function with data from the request body
        const data = await messageCreation(req.body);

        // Send a success response with status code 200 and the created message data
        return mainApiResponse(res, 200, "success", "Message created successfully", []);
    } catch (err) {
        // Send an error response with status code 500 in case of an internal server error
        return mainApiResponse(res, 500, "failed", "Internal server error", []);
    }
}


/**
 * @function listMessageWithPagination
 * @description Retrieves messages with pagination and sorting.
 * @param {Object} req - The request object, containing query parameters for pagination and sorting.
 * @param {Object} res - The response object used to send the response back to the client.
 * @param {Function} next - The next middleware function (not used in this function).
 * @returns {Object} - A JSON response containing the status, message, and data of fetched messages.
 */
async function listMessageWithPagination(req, res, next) {
    try {
        // Destructure query parameters with default values
        // limit: Number of records per page (default: 10)
        // page: Current page number (default: 0)
        // sort: Sorting order (1 for ascending, -1 for descending, default: 1)
        let { limit = 10, page = 1, sort = 1 } = req.query;

        page = page < 1 ? 1 : +page;
        sort = [1, -1].includes(+sort) ? +sort : 1;
        limit = limit < 1 ? 10 : +limit;

        // Calculate the number of records to skip for pagination
        const skip = limit * (page - 1);

        // Define the filter to exclude deleted messages
        const filter = {
            isDeleted: false
        };

        // Define the projection to select specific fields from the documents
        const projection = {
            message: 1,  // Include the message field
            dateTime: 1  // Include the dateTime field
        };

        // Call the function to get messages with pagination and sorting
        // Arguments: filter, projection, options (limit, skip, and sort)
        const data = await getMessages(filter, projection, { limit, skip, sort: { createdDate: +sort } });

        // Send a successful response with fetched messages
        return mainApiResponse(res, 200, "success", "Message fetched successfully", data);
    } catch (err) {
        console.log("error in listMessageWithPagination", err);
        // Send an error response in case of an exception
        return mainApiResponse(res, 500, "failed", "Internal server error", []);
    }
}


/**
 * Fetches messages from the database based on the given conditions, projection, and pagination.
 * 
 * @param {Object} condition - The conditions to filter messages.
 * @param {Object} projection - The properties to include or exclude in the results.
 * @param {Object} pagination - Pagination options including sort, skip, and limit.
 * @param {Object} pagination.sort - Sorting criteria.
 * @param {number} pagination.skip - Number of records to skip (for pagination).
 * @param {number} pagination.limit - Number of records to return (for pagination).
 * 
 * @returns {Promise<Array>} - A promise that resolves to an array of messages.
 */
async function getMessages(condition = {}, projection = {}, pagination = {}) {
    try {
        console.log("condition", condition);
        console.log("projection", projection);
        console.log("pagination", pagination);
        // Fetch messages based on condition, projection, and pagination options
        const data = await messageModel
            .find(condition, projection)       // Apply conditions and projection
            .sort({ ...pagination.sort })     // Sort results based on pagination sort options
            .skip(pagination.skip)            // Skip records based on pagination skip option
            .limit(pagination.limit);         // Limit the number of records based on pagination limit

        return data; // Return the fetched data
    } catch (err) {
        console.log("error in getMessages", err);
        // Throw an error if the fetch operation fails
        throw new Error("Unable to fetch messages");
    }
}


/**
 * Creates a new message entry in the database.
 * 
 * @param {Object} data - The input data for message creation.
 * @param {string} data.message - The message content.
 * @param {string} data.date - The date for the message (in format 'yyyy-mm-dd').
 * @param {string} data.time - The time for the message (in format 'hh:mm:ss').
 * @returns {Promise<Object>} - The created message object from the database.
 */
async function messageCreation(data) {
    try {
        // Construct the message data object with message content and combined dateTime
        const messageData = {
            message: data.message,
            dateTime: `${data.date} ${data.time}`,
        };

        // Create a new message entry in the database
        const message = await messageModel.create(messageData);

        // Return the created message object
        return message;
    }
    catch (err) {
        // Throw a new error to be handled by the caller
        throw new Error("Unable to create message");
    }
}


// exporting functions/methodes for further use
module.exports = {
    messageCreationService,
    listMessageWithPagination
};