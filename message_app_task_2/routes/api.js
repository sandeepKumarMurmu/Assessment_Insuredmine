// Import the Express module
const express = require("express");

// Import routes from modules
const messageRoute = require("../modules/message/routes/index");

// Create an Express application instance
const app = express();

// Mount routes on the root path
app.use("/v1", messageRoute);

// Export the Express application instance
module.exports = app;
