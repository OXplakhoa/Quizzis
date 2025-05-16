"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";

export default function JoinRoomForm() {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const socket = useSocket(roomCode, playerName);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      setRoomCode(code);
    }
  }, [searchParams]);

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode || !playerName) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    try {
      if (socket) {
        socket.emit("join-room", roomCode, playerName);
        router.push(`/room/join/${roomCode}?name=${encodeURIComponent(playerName)}`);
      }
    } catch (error) {
      toast.error("Không thể tham gia phòng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoinRoom} className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <label htmlFor="roomCode" className="text-sm font-medium">
          Mã phòng
        </label>
        <Input
          id="roomCode"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          placeholder="Nhập mã phòng"
          maxLength={6}
          className="text-center text-lg tracking-widest"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="playerName" className="text-sm font-medium">
          Tên của bạn
        </label>
        <Input
          id="playerName"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Nhập tên của bạn"
          maxLength={20}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? "Đang tham gia..." : "Bắt đầu"}
      </Button>
    </form>
  );
} 