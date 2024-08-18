// importing from libraries
const mongoose = require('mongoose');

// Define a Mongoose schema for the 'Agent' collection
const agentSchema = new mongoose.Schema({
    agent_name: {
        type: String,
        required: true // Input: Agent name, must be a string and is required
    },
    createdDate: {
        type: Date,
        default: Date.now // Output: Automatically sets the current date and time when the document is created
    },
    updatedDate: {
        type: Date // Output: Date when the document was last updated, manually set
    },
    deletedDate: {
        type: Date // Output: Date when the document was deleted, manually set
    },
    isDeleted: {
        type: Boolean,
        default: false // Output: Indicates if the document is marked as deleted, defaults to false
    },
}, {
    versionKey: false // Disable the '__v' versioning field in the schema
});



// Mongoose middleware to automatically set the `updatedDate` field before saving a document
// Input: None (but operates on the current document being saved)
// Output: Calls the `next` function to proceed to the next middleware or save operation

agentSchema.pre('save', function (next) {
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

// export the schema as a Mongoose model
module.exports = mongoose.model('Agent', agentSchema);
