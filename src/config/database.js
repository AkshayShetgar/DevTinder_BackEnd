const mongoose = require("mongoose");
const URL = "mongodb+srv://akshay77shetgar:tVV7ApxRZorbOexF@nodejs.yrran.mongodb.net/devTinder";

const connectDB = async () => {
    await mongoose.connect(URL);
}


module.exports = {connectDB};
    