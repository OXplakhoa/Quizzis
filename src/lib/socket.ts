import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextApiResponse } from "next";

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer;
    };
  };
};

export const initSocket = (res: NextApiResponseWithSocket) => {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("join-room", (roomCode: string, playerName: string) => {
        socket.join(roomCode);
        socket.to(roomCode).emit("player-joined", {
          id: socket.id,
          name: playerName,
        });
      });

      socket.on("leave-room", (roomCode: string) => {
        socket.leave(roomCode);
        socket.to(roomCode).emit("player-left", socket.id);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }
  return res.socket.server.io;
}; 