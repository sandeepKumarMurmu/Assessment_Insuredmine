// import libraries
const mongoose = require('mongoose');

// Define the schema for the 'message' collection
const messageSchema = new mongoose.Schema({
    // Message content
    message: { type: String, required: true }, // Input: String; Output: The message content
    
    // Date and time when the message was created
    dateTime: { type: String, required: true }, // Input: String (formatted date and time); Output: The date and time of the message
    
    // Timestamp when the document was created
    createdDate: { type: Date, default: Date.now }, // Output: Date (default to the current date and time)
    
    // Timestamp when the document was last updated
    updatedDate: { type: Date }, // Output: Date (optional, will be set when updated)
    
    // Timestamp when the document was deleted
    deletedDate: { type: Date }, // Output: Date (optional, will be set when deleted)
    
    // Flag indicating if the document is deleted
    isDeleted: { type: Boolean, default: false } // Output: Boolean (default to false)
}, {
    versionKey: false // Disable the __v field used for versioning
});


// Middleware to be executed before saving a document
// Input: `this` (the document being saved)
// Output: No direct output; modifies `this` document before saving

messageSchema.pre('save', function (next) {
    if (this.isModified()) {
        // Check if the document has been modified (not a new document)
        if (this.isNew) {
            // Skip setting `updatedDate` if it's a new document
            return next();
        }

        // Set `updatedDate` to the current date and time for existing documents
        this.updatedDate = new Date();
    }
    // Proceed to the next middleware or save operation
    next();
});


// edporting model for further use
module.exports = mongoose.model('Message', messageSchema);