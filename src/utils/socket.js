const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");

const createHashRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = createHashRoomId(userId, targetUserId);
      console.log(firstName + " Joined the room " + roomId);
      socket.join(roomId);
    });

    socket.on("sendMessage", async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = createHashRoomId(userId, targetUserId);
          console.log(firstName + " " + text);

          // saving messages to DB

          await ConnectionRequestModel.findOne({
            $or : [
              {senderId : userId, receiverId : targetUserId, status : "accepted"},
              {senderId : targetUserId, receiverId : userId, status : "accepted"},
            ],
          });

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (err) {
          console.log(err.message);
        }
      }
    );

    socket.on("dissconnect", () => {});
  });
};

module.exports = { initializeSocket };
