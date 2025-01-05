const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://akshay77shetgar:tVV7ApxRZorbOexF@nodejs.yrran.mongodb.net/devTinder");
}

module.exports = {connectDB};