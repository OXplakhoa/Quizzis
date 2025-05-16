"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { toast } from "sonner";

export default function CreateRoomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateRoom = async () => {
    setIsLoading(true);
    try {
      const roomCode = generateRoomCode();
      // TODO: Create room in database
      router.push(`/room/host/${roomCode}`);
      toast.success("Phòng đã được tạo!");
    } catch (error) {
      toast.error("Không thể tạo phòng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCreateRoom}
      disabled={isLoading}
      className="w-full sm:w-auto"
    >
      {isLoading ? "Đang tạo..." : "Tạo Phòng"}
    </Button>
  );
} 