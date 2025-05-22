import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { NextResponse } from "next/server";

let io: SocketIOServer | null = null;

export const initSocket = () => {
  if (!io) {
    io = new SocketIOServer({
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });

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
  return io;
}; 