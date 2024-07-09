console.log("hi");
const { Server } = require("socket.io");

const io = new Server({
  /* options */
  cors: {
    origin: "http://localhost:3000",
  },
});
let onlineUsers = [];
const addNewUser = (username, socketId) => {
  if (username && !onlineUsers.some((user) => user.username === username)) {
    // Remove any existing user with the same socketId
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    onlineUsers.push({ username, socketId });
    console.log("User added:", { username, socketId });
    console.log("Online users:", onlineUsers);
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  //sending event to server
  //io.to().emit("firstEvent", "test");
  // ...
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  });
  //take the "send notification from the client"
  //and send to the destined
  //client(to ensure one to one communication)
  socket.on("sendNotification", ({ senderName, receiverName, type }) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      type,
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

io.listen(5000);
