const mongoose = require("mongoose");
const uuid = require("uuid");
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema, "messages");

module.exports = { Message, messageSchema };
