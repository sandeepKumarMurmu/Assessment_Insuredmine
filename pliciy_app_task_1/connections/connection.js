// importing from the modules
const mongoose = require('mongoose');
const { parentPort } = require('worker_threads');

// Replace with your MongoDB connection string
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';


/**
 * Asynchronously connects to the MongoDB database.
 * 
 * Input: 
 * - None (uses the global `mongoURI` variable for the connection string).
 * 
 * Output: 
 * - Logs a success message if the connection is established.
 * - Logs an error message and exits the process if the connection fails.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,        // Use the new MongoDB URL parser
            useUnifiedTopology: true,     // Use the new MongoDB server discovery and monitoring engine
            serverSelectionTimeoutMS: 50000 // Timeout after 50 seconds if unable to connect
        });
        console.log('MongoDB connected successfully'); // Log success message on successful connection
    } catch (err) {
        // If connection fails, send the error message to the parent thread and log it
        parentPort.postMessage('MongoDB connection error:', err.message);
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process with an error code if connection fails
    }
};


// Export the function for further use
module.exports = connectDB;
