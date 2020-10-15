const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  chat: { type: Schema.Types.ObjectId, required: true, ref: "Chat" },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
