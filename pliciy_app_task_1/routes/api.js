// Import the Express module
const express = require("express");
const multer = require("multer");

// Import userRoutes from userModule
const uploadRoutes = require("../modules/policy/routes/index");

// Create an Express application instance
const app = express();

// Mount userRoutes on the root path
app.use("/v1", uploadRoutes);

// Export the Express application instance
module.exports = app;
