"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import PlayerList from "./PlayerList";
import { useSocket } from "@/hooks/useSocket";
import { Users, Copy, Play, Share2 } from "lucide-react";

interface Player {
  id: string;
  name: string;
  isHost?: boolean;
}

interface HostScreenProps {
  roomCode: string;
}

export default function HostScreen({ roomCode }: HostScreenProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const socket = useSocket(roomCode, "Host");

  useEffect(() => {
    if (!socket) return;

    socket.on("player-joined", (player: Player) => {
      setPlayers((prev) => [...prev, player]);
      toast.success(`${player.name} đã tham gia phòng!`);
    });

    socket.on("player-left", (playerId: string) => {
      setPlayers((prev) => {
        const player = prev.find((p) => p.id === playerId);
        if (player) {
          toast.info(`${player.name} đã rời phòng`);
        }
        return prev.filter((p) => p.id !== playerId);
      });
    });

    return () => {
      socket.off("player-joined");
      socket.off("player-left");
    };
  }, [socket]);

  const handleStartGame = async () => {
    setIsStarting(true);
    try {
      socket?.emit("start-game", roomCode);
      toast.success("Bắt đầu trò chơi!");
    } catch (error) {
      toast.error("Không thể bắt đầu trò chơi. Vui lòng thử lại.");
    } finally {
      setIsStarting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast.success("Đã sao chép mã phòng!");
  };

  const handleShareRoom = async () => {
    try {
      await navigator.share({
        title: "Tham gia phòng quiz của tôi!",
        text: `Tham gia phòng quiz của tôi với mã: ${roomCode}`,
        url: `${window.location.origin}/room/join?code=${roomCode}`,
      });
    } catch (error) {
      handleCopyCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Phòng của bạn
          </h1>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <code className="text-4xl font-mono tracking-wider bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                {roomCode}
              </code>
            </div>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                Sao chép
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareRoom}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Users className="w-5 h-5" />
            <h3 className="text-lg font-semibold">
              Người chơi ({players.length})
            </h3>
          </div>
          <PlayerList players={players} />
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleStartGame}
            disabled={isStarting || players.length < 2}
            size="lg"
            className="w-full sm:w-auto gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Play className="w-5 h-5" />
            {isStarting ? "Đang bắt đầu..." : "Bắt đầu trò chơi"}
          </Button>
        </div>
      </div>
    </div>
  );
} 