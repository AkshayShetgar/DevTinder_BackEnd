const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middleware/auth");

requestRouter.post("/sendRequest",userAuth, async (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent the conection request");
  });

module.exports = requestRouter;