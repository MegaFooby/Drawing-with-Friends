const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  roomid: { type: String, required: true },
  message: {
    msg: { type: String, required: true},
    time: { type: String, required: true},
    from: { type: String, required: true},
    name: { type: String, required: false},
    colour: { type: String, required: false},
    effect: { type: String, required: false},
  },
  createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

module.exports = mongoose.model('ChatMessage', schema);
console.log("Exported Chat Model");