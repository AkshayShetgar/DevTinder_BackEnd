const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = 3000;
require("dotenv").config();
const http = require("http");
const socket = require("socket.io");
const {initializeSocket} = require("./utils/socket");

require("../src/utils/cronJob");

app.use(cors({
  origin : ["http://localhost:5173","http://13.232.97.114"],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials : true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/users");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

const server = http.createServer(app);
const io = socket(server, cors({
  origin : "http://localhost:5173"
}));

initializeSocket(server);

connectDB()
  .then(() => {
    console.log("succesfully Database connected");
    server.listen(port, () => {
      console.log("Server is listening to port " + port);
    });
  })
  .catch((err) => console.error("Database cannot be connected"));
