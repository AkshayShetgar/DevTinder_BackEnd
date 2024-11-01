const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/users");

userRouter.get("/user/requests/received", userAuth, async (req, res) => {   
    try{
        const user = req.user._id;
        const connectioRequest = await ConnectionRequest.find({
            receiverId : user,
            status : "interested"
        }).populate("senderId", ["firstName", "lastName"]);

        res.json({message : "Data fetched successfully", connectioRequest});
    }catch(err){
        res.status(400).send("ERROR "+ err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const user = req.user._id;
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {status : "accepted", receiverId : user},
                {status : "accepted", senderId : user}, 
            ],
        }).populate("senderId", ["firstName", "lastName"]).populate("receiverId", ["firstName", "lastName"]);

        const data = connectionRequest.map((row) => {
            if(row.receiverId._id.toString() === user.toString()){
                return row.senderId;
            }
            return row.receiverId;
        });
        res.json({data});
    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try{
        const user = req.user._id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 40 ? 40 :limit;
        const skip = (page - 1) * limit;
        const connectionRequest = await ConnectionRequest.find({
            $or : [
                {receiverId : user},
                {senderId : user},
            ]
        }).select("senderId receiverId").populate("senderId", "firstName").populate("receiverId", "firstName");

        const hideUsers = connectionRequest.flatMap(req => [req.senderId, req.receiverId]);

        const users = await User.find({
            $and : [
                {_id : {$nin : hideUsers}},
                {_id : {$ne : user}},
            ],
        }).select("firstName lastName about skills age gender photoUrl").skip(skip).limit(limit);
        res.send(users);
    }catch(err){
        res.status(400).send("ERROR " + err.message);
    }
})

module.exports = userRouter;