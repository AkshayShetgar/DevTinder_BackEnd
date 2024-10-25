const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

requestRouter.post("/request/send/:status/:receiverId",userAuth, async (req, res) => {
  try{
    const senderId = req.user._id;
    const status = req.params.status;
    const receiverId = req.params.receiverId;

    const allowedStaus = ["ignored", "interested"]
    if  (!allowedStaus.includes(status)){
      return res.status(400).json({message : "Invalid status type: " + status});
    }

    const receiver = await User.findById(receiverId);
    if(!receiver){
      throw new Error("user does not exists");
    }

    if(senderId.equals(receiverId)){
      throw new Error("Cannot send request to yourself");
    }

    const existingConnection = await ConnectionRequest.findOne({
      $or : [{ senderId, receiverId}, {senderId : receiverId, receiverId : senderId}]
    });
    
    if(existingConnection){
      throw new Error("Connection already exists");
    }

    const connectionRequest = new ConnectionRequest({
      senderId, receiverId, status
    });
    const data = await connectionRequest.save();
    res.json({messge : req.user.firstName + " is " + status + " in " + receiver.firstName, data});
  }catch(err){
    res.status(400).send(err.message);
  }
  });

module.exports = requestRouter;