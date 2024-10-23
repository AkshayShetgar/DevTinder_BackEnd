const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/users");
const app = express();
const {signupValidation} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try{
    const {emailId, password} = req.body;
    const checkEmail = await User.findOne({emailId});
    if(!checkEmail){
      throw new Error("Invalid credentials");
    }
    const isPassword = await bcrypt.compare(password, checkEmail.password);
    if(isPassword){
      const token = await jwt.sign({_id : checkEmail._id}, "DEV@TINDER123");
      res.cookie("token", token);
      res.send("Login Successfully");
    }else{
      throw new Error("Invalid credentials");
    }
  }catch(err){
    res.status(400).send(err.message);
  }
});

app.get("/profile", async (req, res) =>{
  try{
    const cookie = req.cookies;
    const {token} = cookie;
    if(!token){
      throw new Error("Invalid Token");
    }
    const decode = await jwt.verify(token, "DEV@TINDER123");
    const {_id} = decode;
    const user = await User.findById(_id);
    if(!user){
      throw new Error("User does not exists");
    }
    res.send(user);
  }catch(err){
    res.status(400).send(err.message);
  }
});

app.get("/userName", async (req, res) => {
  const {emailId} = req.body;
  try {
    const userName = await User.find({emailId});
    res.send(userName);
  } catch (err) {
    res.status(400).send("User not found");
  }
});

app.get("/userId", async (req, res) => {
  const id = req.body._id;
  try {
    const userId = await User.findById({ _id: id });
    res.send(userId);
  } catch (err) {
    res.status(400).send("User not found");
  }
});

app.get("/user", async (req, res) => {
  const userName = req.body.firstName;
  try {
    const users = await User.findOne({ firstName: userName });
    if (users.length === 0) {
      res.status(400).send("User not found...");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong...");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Soething went wrong...");
  }
});

app.delete("/deleteUser", async (req, res) => {
  const deleteUser = req.body._id;
  try {
    const user = await User.findByIdAndDelete(deleteUser);
    res.send(user);
  } catch (err) {
    res.status(400).send("User not found");
  }
});

app.patch("/updateUser", async (req, res) => {
  try {
    const ALLOW_UPDATES = [
      "lastName",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    const isAllowUpdates = Object.keys(req.body).every((key) =>
      ALLOW_UPDATES.includes(key)
    );

    if (!isAllowUpdates) {
        throw new Error("Updates not allowed...");
    }

    const update = await User.updateOne(
      { firstName: "MS" },
      { firstName: "Mahendra" }
    );

    res.send(update);

  } catch (err) {
    res.status(400).send("Falied " + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("succesfully Database connected");
    app.listen(port, () => {
      console.log("Server is created successfully...");
    });
  })
  .catch((err) => console.error("Database cannot be connected"));
