const express = require('express');
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const server = express();

server.use(express.json());
server.use("/posts", postRouter);
server.use("/users", userRouter);

//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get("Origin")}`)
  next();
}
server.use(logger);

module.exports = server;
