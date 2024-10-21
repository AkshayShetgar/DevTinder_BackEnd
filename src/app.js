const express = require("express");
const app = express();
const port = 4000;

app.get("/user", (req, res) => {
    res.send("waiting for the to come");
});

app.post("/user", (req, res) => {
    res.send({name : "Akshay Shetgar", City : "Gulbarga"});
});

app.delete("/user", (req, res) => {
    res.send("Deleted successfully...");
});

app.listen(port, () => {
    console.log("Server is created successfully...");
});