// const Server = require("socket.io").Server;
// const io = new Server();
const { v4 } = require("uuid");
const conversationTypes = require("../config/conversationTypes");
const { Conversation } = require("../models/conversationModel");
const { Message } = require("../models/message");
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
      let conversations = await Conversation.find({
        users: [user._id],
      })
        .populate({ path: "users" })
        .populate({ path: "messages" });
      // .populate("messages.user");

      // conversations = conversations.filter((item) => item.users.includes(user));
      conversations.forEach((conv) => {
        socket.join(conv._id);
        socket.broadcast.emit("user_joined", { user });
      });
      socket.emit("conversations", conversations);
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
      socket.emit("conversations_error", { detail: "Server error" });
    }

    //Create all
    socket.on("create_conversation", async ({ title }) => {
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
          type: conversationTypes.groupChat,
          users: [user._id],
        });

        conversation = await conversation.save();
        conversation = await Conversation.findById(conversation._id)
          .populate("users")
          .populate("messages");
        // console.log(conversation);
        socket.join(conversation.id);
        socket.emit("conversation_added", {
          status: "success",
          data: conversation,
        });
      } catch (error) {
        console.log(error);
        socket.emit("conversations_error", { detail: "Server error" });
      }
    });

    //Add private conversation
    socket.on("create_private_conversation", async ({ memberId }) => {
      try {
        const user = await User.findOne({ id: userId });
        const member = await User.findOne({ id: memberId });
        if (!member)
          return socket.emit("conversations_error", {
            detail: "User information cannot be found",
          });

        let conversation = await Conversation.create({
          title: v4(),
          users: [user._id, member._id],
        });
        conversation = await Conversation.findById(conversation._id)
          .populate("users")
          .populate("messages");
        // console.log(conversation);
        socket.join(conversation.id);
        socket.emit("conversation_added", {
          status: "success",
          data: conversation,
        });
      } catch (error) {
        console.log(error);
        socket.emit("conversations_error", { detail: "Server error" });
      }
    });
  });
};

const updateConversation = (io) => {
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

      socket.on("update_conversation_group", async ({ groupId, title }) => {
        if (!groupId)
          return socket.emit("conversations_error", {
            detail: "Group information not sent",
          });
        let group = await Conversation.findOne({ _id: groupId });
        if (!group)
          return socket.emit("conversations_error", {
            detail: "Group information found",
          });
        if (!group.users.includes(user._id))
          return socket.emit("conversations_error", {
            detail: "Must belong to the group to make changes",
          });
        group = await Conversation.findByIdAndUpdate(group._id, {
          $set: { title },
        });
        const groups = await Conversation.find({ users: [user._id] })
          .populate({ path: "users" })
          .populate({ path: "messages" });
        socket.join(group._id);
        io.to(group._id).emit("update_conversation", {
          status: "success",
          data: groups,
        });
      });
    } catch (error) {
      console.log(error);
      socket.emit("conversations_error", { detail: "Server error" });
    }
  });
};

const addMemberToGroup = (io) => {
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

      socket.on("add_conversation_member", async ({ convId, userId }) => {
        const member = await User.findById(userId);
        if (!member)
          return socket.emit("conversations_error", {
            detail: "User information cannot be found",
          });
        let conversation = await Conversation.findById(convId);
        if (!conversation)
          return socket.emit("conversations_error", {
            detail: "Conversation cannot be found",
          });

        if (conversation.users.includes(member._id))
          return socket.emit("conversations_error", {
            detail: "User is already a group member",
          });

        conversation.users.push(user._id);

        await conversation.save();

        conversation = await Conversation.findById(conversation._id)
          .populate("users")
          .populate("messages");
        socket.join(conversation._id);
        io.to(conversation._id).emit("added_member", conversation);
      });
    } catch (error) {
      console.log(error);
      socket.emit("conversations_error", { detail: "Server error" });
    }
  });
};

const addMessage = (io) => {
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

      socket.on("send_message", async ({ convId, text }) => {
        const conversation = await Conversation.findById(convId);
        if (!conversation)
          return socket.emit("conversation_error", {
            detail: "Conversation information not fount",
          });
        let message = await Message.create({
          text,
          conversation: conversation._id,
          user: user._id,
        });
        message = await Message.findById(message._id).populate("user");
        conversation.messages.push(message._id);
        await conversation.save();
        socket.join(conversation._id);
        io.to(conversation._id).emit("message", message);
      });
    } catch (error) {
      console.log(error);
      socket.emit("conversations_error", { detail: "Server error" });
    }
  });
};

module.exports = {
  listConversations,
  createCreateConversation,
  updateConversation,
  addMemberToGroup,
  addMessage,
};
