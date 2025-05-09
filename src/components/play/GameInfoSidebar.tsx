import { Card } from "@/components/ui/card";
import { BrainCircuit, Clock, Trophy } from "lucide-react";
import { Game } from "@prisma/client";

type Props = {
  game: Game;
  points: number;
  totalPoints: number;
};

const GameInfoSidebar = ({ game, points, totalPoints }: Props) => {
  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-medium">Chủ đề: {game.topic}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Thời gian: 00:00</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          <span className="font-medium">Điểm: {points}/{totalPoints}</span>
        </div>
      </div>
    </Card>
  );
};

export default GameInfoSidebar; 