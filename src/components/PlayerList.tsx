"use client";

import { Avatar, AvatarFallback } from "./ui/avatar";

interface Player {
  id: string;
  name: string;
  isHost?: boolean;
}

interface PlayerListProps {
  players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Người chơi ({players.length})</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
          >
            <Avatar>
              <AvatarFallback>
                {player.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">
                {player.name}
                {player.isHost && (
                  <span className="ml-2 text-sm text-blue-600">(Chủ phòng)</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 