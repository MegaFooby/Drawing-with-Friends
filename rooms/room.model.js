const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String, unique: true, required: true },
    isPrivate: { type: Boolean, required: true },
    users: { type: [String], required: true },
    hiddenUsers: { type: [String], required: true},
    creatorUsername: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Room', schema);
console.log("Exported Room Model");