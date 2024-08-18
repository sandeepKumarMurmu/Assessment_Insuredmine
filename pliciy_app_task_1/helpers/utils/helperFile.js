/**
 * Generates a random alphanumeric string of a specified length.
 *
 * @param {number} len - The length of the random string to generate. Default is 5.
 * @returns {string} - A random alphanumeric string of the specified length.
 * @throws {Error} - Throws an error if the input parameter `len` is not a number.
 */
function randomString(len = 5) {
    try {
        // Check if len is a number, if not, throw an error
        if (typeof len !== 'number') {
            throw new Error("Invalid string generation data provided.");
        }

        // Generate a long random alphanumeric string
        const randomStr = Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        // Generate a random index to start slicing the random string
        const index_selected = Math.random() * 10;

        // Return a substring of the generated random string with the specified length
        return randomStr.substring(Math.trunc(index_selected), Math.trunc(index_selected) + len);
    } catch (err) {
        // Throw an error if an exception occurs
        throw new Error(err?.message);
    }
}



// Export the function for further use
module.exports = {
    randomString
};