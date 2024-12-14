const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Please login!");
        }
        const decode = await jwt.verify(token, "DEV@TINDER123");
        const {_id} = decode;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }catch(err){
        res.status(400).send(err.message);
    }
};

module.exports = {userAuth};