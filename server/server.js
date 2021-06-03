require("dotenv").config();

const express = require("express");
const app = express();

const cors = require("cors");
const routers = require("./routers/index");

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const socketFilm = require("./socket/film");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

app.use(express.json());
app.use(cors());
app.use("/api/v1", routers);
app.use(express.static("storage"));

const filmNameSpace = io.of("/films").on("connection", (socket) => {
  socketFilm.respond(filmNameSpace, socket);
});

server.listen(9000);
