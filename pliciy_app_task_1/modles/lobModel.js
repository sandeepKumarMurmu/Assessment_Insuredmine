// importing from libraries
const mongoose = require('mongoose');

// Define the schema for the Policy Category (LOB)
const lobSchema = new mongoose.Schema({
    // Category name for the LOB, required field
    category_name: { type: String, required: true },

    // Date when the record was created, default is the current date and time
    createdDate: { type: Date, default: Date.now },

    // Date when the record was last updated
    updatedDate: { type: Date },

    // Date when the record was deleted (soft delete)
    deletedDate: { type: Date },

    // Boolean flag indicating if the record is deleted
    isDeleted: { type: Boolean, default: false }
}, {
    // Disable version key (__v field)
    versionKey: false
});


// Mongoose middleware to automatically set the `updatedDate` field before saving a document
// Input: None (but operates on the current document being saved)
// Output: Calls the `next` function to proceed to the next middleware or save operation

lobSchema.pre('save', function (next) {
    // Check if the document has been modified
    if (this.isModified()) {
        // Skip setting `updatedDate` if the document is new
        if (this.isNew) {
            return next();
        }

        // Set `updatedDate` to the current date and time for existing documents
        this.updatedDate = new Date();
    }
    // Proceed to the next middleware or save operation
    next();
});



// Export the schema for use in other parts of the application
module.exports = mongoose.model('LOB', lobSchema);
