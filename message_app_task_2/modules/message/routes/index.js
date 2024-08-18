// Import the Express module
const express = require("express");

const { messageCreatrionController, listAllMessagesController } = require("../controller/message.controller");

// Create an Express application instance
const app = express();

// Mount userRoutes on the root path
app.post("/message", messageCreatrionController);
app.get("/message", listAllMessagesController);

// Export the Express application instance
module.exports = app;
