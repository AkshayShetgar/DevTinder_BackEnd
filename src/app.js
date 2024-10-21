const express = require("express");
const app = express();
const port = 4000;

app.get("/", (req, res) => {
    res.send("Dashboard Page");
});

app.get("/login", (req, res) => {
    res.send("Login Page");
});

app.get("/home", (req, res) => {
    res.send("Home Page");
});

app.listen(port, () => {
    console.log("Server is created successfully...");
});