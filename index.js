const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const Server = require("socket.io").Server;
const io = new Server(httpServer, { cors: { origin: "*" } });
const mongoose = require("mongoose");
const mongoDbConfigs = require("./config/mongoDbConfigs");
const userRouter = require("./routes/users");
require("./passport");

app.use(express.json());

app.use("/users", userRouter);

const port = process.env.PORT || 5000;

mongoose.connect(mongoDbConfigs.connectionString, () => {
  console.log("DB connected");
  httpServer.listen(port, () => {
    console.log("App is running on port " + port);
  });
});
