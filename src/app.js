const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/users");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try{
    if(req.body.skills.length > 10){
      throw new Error("Skills cannot be more then 10");
    }
      const user = new User(req.body);
      await user.save();
      res.send("User added successfully...");
  }catch(err){
    res.status(400).send(err.message);
  }

});

app.get("/userName", async (req, res) => {
  const mail = req.body.emailId;
  try {
    const userName = await User.find({ emailId: mail });
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
