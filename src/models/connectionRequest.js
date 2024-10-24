const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
   receiverId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
   },
   status : {
    type : String,
    required : true,
    enum : {
        values : ["ignore", "interested", "accepted", "rejected"],
        message : `{value} is incorrect status`
    },
   },
}, {timestamps : true});

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;