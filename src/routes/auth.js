const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const {signupValidation} = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
    try{
      signupValidation(req);
      const {firstName, lastName, password, emailId} = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName, lastName, password : passwordHash, emailId
      });
      await user.save();
      res.send("User added successfully...");
    }catch(err) {
      res.status(400).send("ERROR :" + err.message);
    }
  });

  authRouter.post("/login", async (req, res) => {
    try{
      const {emailId, password} = req.body;
      const checkEmail = await User.findOne({emailId});
      if(!checkEmail){
        throw new Error("Invalid credentials");
      }
      const isPassword = await bcrypt.compare(password, checkEmail.password);
      if(isPassword){
        const token = await jwt.sign({_id : checkEmail._id}, "DEV@TINDER123", {expiresIn : "10h"});
        res.cookie("token", token);
        res.send("Login Successfully");
      }else{
        throw new Error("Invalid credentials");
      }
    }catch(err){
      res.status(400).send(err.message);
    }
  });

  module.exports = authRouter;