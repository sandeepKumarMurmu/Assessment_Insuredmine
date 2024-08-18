/**
 * Sends a standardized API response.
 *
 * @param {Object} res - The Express response object.
 * @param {number} [status=500] - The HTTP status code to send in the response. Default is 500.
 * @param {string} [type='failed'] - The type of response ('success' or 'failed'). Default is 'failed'.
 * @param {string} [msg=''] - The message to send in the response. Default is an empty string.
 * @param {Array|Object} [data=[]] - The data to include in the response if the type is 'success'. Default is an empty array.
 * @returns {Object} The response object with the specified status, message, and data.
 */
function mainApiResponse(res, status = 500, type = 'failed', msg = '', data = []) {
    // Initialize response data with status and message
    let resData = {
        status: type === 'success' ? 'success' : 'failed',
        message: msg,
    };

    // If the response type is 'success', add the data to the response
    if (type !== 'failed') {
        resData.data = data;
    }

    // Return the JSON response with the specified status code
    return res.status(status).json(resData);
}


// Export the function for further use
module.exports = {
    mainApiResponse
}