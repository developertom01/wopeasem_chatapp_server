const mongoose = require("mongoose");
const conversationTypes = require("../config/conversationTypes");
const { userSchema } = require("./users");
const { Schema, model } = mongoose;

const messageSchema = new Schema(
  {
    user: userSchema,
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const conversationSchema = new Schema(
  {
    title: {
      type: String,
    },
    users: [userSchema],
    messages: [messageSchema],
    type: {
      type: String,
      default: conversationTypes.privateChat,
    },
  },
  { timestamps: true }
);

const Conversation = model("Conversation", conversationSchema, "converations");
module.exports = { messageSchema, conversationSchema, Conversation };
