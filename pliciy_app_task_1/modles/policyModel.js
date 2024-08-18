const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policy_number: { type: String, required: true },
    policy_start_date: { type: Date, required: true },
    policy_end_date: { type: Date, required: true },
    lob_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LOB' },
    carrier_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyCarrier' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date},
    deletedDate: { type: Date },
    isDeleted: { type: Boolean, default: false }
},{
    versionKey: false
});

// policySchema.pre('save', function (next) {
//     if (this.isModified()) {
//         if (this.isNew) {
//             return next();
//         }
//         this.updatedDate = new Date();
//     }
//     next();
// });


module.exports = mongoose.model('Policy', policySchema);
