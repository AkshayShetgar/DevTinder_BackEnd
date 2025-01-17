const express = require("express");
const { userAuth } = require("../middleware/auth");
const { Chat } = require("../models/chat");
const User = require("../models/users");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  await User.findByIdAndUpdate(userId, {
    lastSeen : new Date(),
  });

  await User.findByIdAndUpdate(targetUserId, {
    lastSeen : new Date(),
  });


  try {
    let chat = await Chat.findOne({
        participants : { $all : [userId, targetUserId] }
    }).populate({
        path : "messages.senderId",
        select : "firstName lastName"
    });
    if(!chat) {
        chat = new Chat({
            participants : [userId, targetUserId],
            messages : [],
        });
    }
    await chat.save();
    res.json(chat);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = chatRouter;
