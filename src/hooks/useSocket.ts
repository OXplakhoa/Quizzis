import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (roomCode?: string, playerName?: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    const initSocket = async () => {
      await fetch("/api/socket");
      socketRef.current = io();

      if (roomCode && playerName) {
        socketRef.current.emit("join-room", roomCode, playerName);
      }
    };

    initSocket();

    return () => {
      if (socketRef.current) {
        if (roomCode) {
          socketRef.current.emit("leave-room", roomCode);
        }
        socketRef.current.disconnect();
      }
    };
  }, [roomCode, playerName]);

  return socketRef.current;
}; 