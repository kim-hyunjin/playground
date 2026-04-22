import express from "express";
import http from "http";
import path from "path";
import { Server as SocketIO } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const __dirname = path.join(path.resolve(), "/src");
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new SocketIO(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, {
  auth: false,
});

function publicRooms() {
  const publicRooms = [];

  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;

  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });

  return publicRooms;
}

function countUsers(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(wsServer.sockets.adapter);
    console.log(`Socket Event: ${event}`);
  });
  socket.emit("rooms_updated", publicRooms());

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countUsers(room) - 1)
    );
  });

  socket.on("nickname", (nickname) => {
    socket["nickname"] = nickname;
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done(); // 프론트엔드에서 실행됨
    socket.emit("welcome", socket.nickname, countUsers(roomName));
    socket.to(roomName).emit("welcome", socket.nickname, countUsers(roomName));
    wsServer.sockets.emit("rooms_updated", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("rooms_updated", publicRooms());
  });
});

httpServer.listen(3000, () => {
  console.log("server start...");
});
