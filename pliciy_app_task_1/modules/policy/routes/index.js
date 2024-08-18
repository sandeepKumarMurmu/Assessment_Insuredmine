// Import the Express module
const express = require("express");

const { handelUploadedFileController, getUserByUserName } = require("../controller/xls_csv.controller");

// Create an Express application instance
const app = express();

// Mount userRoutes on the root path
app.post("/document", handelUploadedFileController);
app.get("/user/:userName", getUserByUserName);

// Export the Express application instance
module.exports = app;
