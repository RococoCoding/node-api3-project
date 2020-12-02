const express = require('express');
const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const server = express();

server.use(express.json());
server.use("/posts", postRouter);
server.use("/users", userRouter);
server.get('/', async (req, res) => {
  try {
    const messageOfTheDay = process.env.MOTD || 'Hello World!';
    res.status(200).json({ motd: messageOfTheDay});
  } catch (error) {
    console.error('\nERROR', error);
    res.status(500).json({ error: 'Cannot retrieve the shoutouts' });
  }
});
//custom middleware

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get("Origin")}`)
  next();
}
server.use(logger);

module.exports = server;
