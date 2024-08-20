const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const { SERVER_STARTED } = require("./constants");
const { chatHandler } = require("./utils/chat");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.post("/", (req, res) => {
  const { name, room, lang } = req.body;
  if (name && room) {
    res.redirect(`/chat.html?username=${name}&room=${room}&lang=${lang}`);
  }
});
chatHandler(io);

const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`${SERVER_STARTED} ${port}`));
