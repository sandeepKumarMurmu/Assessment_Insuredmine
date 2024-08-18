const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    firstname: { type: String, required: true },
    dob: { type: Date, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    state: { type: String, required: false },
    zip: { type: String, required: false },
    email: { type: String, required: false },
    gender: { type: String, required: false },
    userType: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
    deletedDate: { type: Date },
    isDeleted: { type: Boolean, default: false }
},{
    versionKey: false
});


userSchema.pre('save', function (next) {
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

module.exports = mongoose.model('User', userSchema);