// importing from libraries
const mongoose = require('mongoose');

// Define the schema for the Policy Carrier model
// Input: No direct input, but the schema is used to define the structure of Policy Carrier documents in MongoDB
// Output: A schema object that defines the structure and validation of Policy Carrier documents
const policyCarrierSchema = new mongoose.Schema({
    company_name: { 
        type: String, 
        required: true // The company name is a mandatory field
    },
    createdDate: { 
        type: Date, 
        default: Date.now // Automatically sets the created date to the current date when a new document is created
    },
    updatedDate: { 
        type: Date // The date when the document was last updated (can be manually set)
    },
    deletedDate: { 
        type: Date // The date when the document was deleted (if applicable)
    },
    isDeleted: { 
        type: Boolean, 
        default: false // Flag to indicate if the document is considered deleted (soft delete)
    }
},{
    versionKey: false // Disables the versioning (__v) field in documents
});


// Mongoose middleware to automatically set the `updatedDate` field before saving a document
// Input: None (but operates on the current document being saved)
// Output: Calls the `next` function to proceed to the next middleware or save operation

policyCarrierSchema.pre('save', function (next) {
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

// exporting the schema as a Mongoose model
module.exports = mongoose.model('PolicyCarrier', policyCarrierSchema);