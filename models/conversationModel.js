const mongoose = require("mongoose");
const uuid = require("uuid");
const conversationTypes = require("../config/conversationTypes");
const { Schema, model } = mongoose;

const conversationSchema = new Schema(
  {
    title: {
      type: String,
      unique: false,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    type: {
      type: String,
      default: conversationTypes.privateChat,
    },
  },
  { timestamps: true }
);

const Conversation = model("Conversation", conversationSchema, "conversations");
module.exports = { conversationSchema, Conversation };
