const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatSchema = new Schema({
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  users: [{ type: Schema.Types.ObjectId, required: true, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);
