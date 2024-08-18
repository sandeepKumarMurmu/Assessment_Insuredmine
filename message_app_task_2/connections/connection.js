const mongoose = require('mongoose');

// Replace with your MongoDB connection string
// Use an environment variable or default to localhost if not provided
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using the connection string
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,      // Use the new URL parser
            useUnifiedTopology: true,  // Use the new Server Discover and Monitoring engine
        });
        console.log('MongoDB connected successfully'); // Log success message if connected
    } catch (err) {
        // Log error message if connection fails
        console.error('MongoDB connection error:', err.message);
        // Exit the process with a failure code if the connection fails
        process.exit(1);
    }
};

// Export the connectDB function to be used in other parts of the application
module.exports = connectDB;
