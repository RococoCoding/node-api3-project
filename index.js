// code away!
require('dotenv').config(); // line 1

const server = require("./server");
const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`server up and running on ${port}`);
});