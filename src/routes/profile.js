const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const {userAuth} = require("../middleware/auth");
const {validateProfileData} = require("../utils/validation");
const jwt = require("jsonwebtoken");


profileRouter.get("/profile/view", userAuth, async (req, res) =>{
    try{ 
      const user = req.user;
      if (!user) {
        return res.status(401).send('User not authenticated');
      }
      res.send(user);
    }catch(err){
      res.status(400).send(err.message);
    } 
  });

  profileRouter.patch("/profile/update", userAuth, async (req, res) => {
   try{
    if(!validateProfileData(req)){
      throw new Error("Invalid Edit request");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();
    res.json({message : `${user.firstName}, your profile updated successfully`, data : user});
   }catch(err){
    res.status(400).send(err.message);
   }
  });

  profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
    const user = req.user;
    const {password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.send("Password updated successfully");
  });


module.exports = profileRouter;