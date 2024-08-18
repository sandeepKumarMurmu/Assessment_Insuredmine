const mongoose = require('mongoose');

const userAccountSchema = new mongoose.Schema({
    account_name: { type: String, required: true },
    account_type: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date },
    deletedDate: { type: Date },
    isDeleted: { type: Boolean, default: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{
    versionKey: false
});

userAccountSchema.pre('save', function (next) {
    if (this.isModified()) {
        if (this.isNew) {
            return next();
        }
        this.updatedDate = new Date();
    }
    next();
});

module.exports = mongoose.model('UserAccount', userAccountSchema);
