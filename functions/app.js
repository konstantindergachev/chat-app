const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const serverless = require("serverless-http");
const { SERVER_STARTED } = require("./constants");
const { chatHandler } = require("./utils/chat");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

chatHandler(io);

const router = express.Router();
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));
app.use("/.netlify/functions/app", router);

const port = process.env.PORT || 9000;
server.listen(port, () => console.log(`${SERVER_STARTED} ${port}`));

module.exports.handler = serverless(app);
