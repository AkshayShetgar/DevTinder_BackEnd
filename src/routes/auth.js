const express = require("express");
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/users");
const {signupValidation} = require("../utils/validation");


authRouter.post("/signup", async (req, res) => {
    try{
      signupValidation(req);
      const {firstName, lastName, password, emailId, age, skills, about, photoUrl} = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName, lastName, password : passwordHash, emailId, age, skills, about, photoUrl
      });
      const savedUser = await user.save();
      const token = await jwt.sign({_id : savedUser._id}, "DEV@TINDER123", {expiresIn : "10h"});
      res.cookie("token", token);
      res.json({message : "User added successfully", data : savedUser});
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
        res.send(checkEmail);
      }else{
        throw new Error("Invalid credentials");
      }
    }catch(err){
      res.status(400).send(err.message);
    }
  });

  authRouter.post("/logout", async (req, res) => {
    try{
      res.clearCookie("token");
      // res.cookie("token", null, {
      //   expiresIn : new Date(Date.now()),
      // });
      res.send("Successfully logged out");
    }catch(err){
      res.status(400).send(err.message);
    }
    
  })

  module.exports = authRouter;