const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    roomid: { type: String, required: true },
    user: { type: String, required: true },
    json: { type: String, required: true },
    erase: { type: Boolean, required: false},
    createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    }
});

module.exports = mongoose.model('Drawing', schema);
console.log("Exported Drawing Model");
