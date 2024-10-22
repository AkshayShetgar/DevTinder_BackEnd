const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/users");
const app = express();
const port = 3000;

app.post("/signup", async (req, res) => {
    const userObj = {
        firstName : "MS",
        lastName : "Dhoni",
        emailId : "dhoni@gmail.com",
        password : "Dhoni@019",
    };

    const user = new User(userObj);
    await user.save();
    res.send("User added successfully...");
})

connectDB()
  .then(() => {
    console.log("succesfully Database connected");
    app.listen(port, () => {
      console.log("Server is created successfully...");
    });
  })
  .catch((err) => console.error("Database canno tbe connected"));
