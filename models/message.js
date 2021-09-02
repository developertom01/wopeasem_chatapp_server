const mongoose = require("mongoose");
const uuid = require("uuid");
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    uid: {
      type: String,
      default: uuid.v4(),
      unique: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation" },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = model("Message",messageSchema)

module.exports = {Message,messageSchema}