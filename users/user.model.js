const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { type: String, unique: true, required: true },
    hash: { type: String, required: true },                     // This is the password
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    admin: { type: Boolean, default: false },
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

schema.set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);
console.log("Exported User Model");