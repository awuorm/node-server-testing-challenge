const server = require("./server");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;



server.listen(port, () => {
  console.log("listening on port", port);
});

