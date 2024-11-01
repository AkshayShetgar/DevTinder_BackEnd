const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : "User"
    },
   receiverId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : "User"
   },
   status : {
    type : String,
    required : true,
    enum : {
        values : ["ignored", "interested", "accepted", "rejected"],
        message : `{values} is incorrect status1`
    },
   },
}, {timestamps : true});

connectionRequestSchema.index({senderId : 1, receiverId : 1});

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;