// const Server = require("socket.io").Server;
// const io = new Server();
const { user } = require("../config/userTypes");
const { Conversation } = require("../models/conversationModel");
const { User } = require("../models/users");
// const io = new Server();

const listConversations = (io) => {
  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.query;
    try {
      // Get user
      const user = await User.findOne({ id: userId });
      if (!user)
        return socket.emit("conversations_error", {
          status: "error",
          detail: " An error occured findiing user profile",
        });

      //Get conversations
      consversations = await Conversation.find({}).populate({ path: "users"});
      consversations.forEach((conv) => {
        socket.join(conv.id);
        socket.broadcast.emit("user_joined");
      });
      socket.emit("conversations", consversations);
    } catch (error) {
      console.log(error);
      socket.emit("conversations_error", { detail: "Server error" });
    }

    socket.on("disconnect", () => {
      console.log("User Left");
    });
  });
};

const createCreateConversation = (io) => {
  io.on("connection", async (socket) => {
    const { userId } = socket.handshake.query;
    try {
      const user = await User.findOne({ id: userId });
      // console.log(user);
      if (!user)
        return socket.emit("conversations_error", {
          status: "error",
          detail: " An error occured findiing user profile",
        });
    } catch (error) {
      console.log(error);
      socket.emit("conversations_error", { detail: "Server error" });
    }

    //Create all
    socket.on("create_conversation", async ({ title, type }) => {
      if (!title)
        return socket.emit("conversations_error", {
          status: "error",
          detail: "Conversation title is required",
        });
      // const id = user._id;
      try {
        const user = await User.findOne({ id: userId });
        let conversation = new Conversation({
          title,
          type,
          users: [user._id],
        });

        conversation = await conversation.save();
        // console.log(conversation);
        socket.join(conversation.id);
        socket.emit("conversation_added", {
          status: "success",
          data: JSON.stringify(conversation),
        });
      } catch (error) {
        console.log(error);
        socket.emit("conversations_error", { detail: "Server error" });
      }
    });
  });
};

module.exports = { listConversations, createCreateConversation };
