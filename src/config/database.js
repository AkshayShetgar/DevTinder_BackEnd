const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://akshay77shetgar:tVV7ApxRZorbOexF@nodejs.yrran.mongodb.net/devTinder");
}

module.exports = {connectDB};
    