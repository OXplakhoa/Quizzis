import { Card } from "@/components/ui/card";
import { BrainCircuit, Clock, Trophy } from "lucide-react";
import { Game } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { formatMMSS } from "@/lib/utils";
import { useEffect, useState } from "react";

type Props = {
  game: Game;
  points?: number;
  totalPoints?: number;
  isCompleted?: boolean;
  isOpenEnded?: boolean;
  finalTime?: string;
};

const GameInfoSidebar = ({ 
  game, 
  points = 0,
  totalPoints = 0,
  isCompleted = false, 
  isOpenEnded = false,
  finalTime
}: Props) => {
  const [now, setNow] = useState(new Date());
  const [displayTime, setDisplayTime] = useState<string>("");

  useEffect(() => {
    if (isCompleted) {
      if (finalTime) {
        setDisplayTime(finalTime);
      } else {
        setDisplayTime(formatMMSS(differenceInSeconds(now, game.timeStarted)));
      }
      return;
    }
    
    const interval = setInterval(() => {
      const currentTime = new Date();
      setNow(currentTime);
      setDisplayTime(formatMMSS(differenceInSeconds(currentTime, game.timeStarted)));
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, game.timeStarted, finalTime]);
  const displayPoints = isOpenEnded 
    ? `${points.toFixed(2)}/${totalPoints}`
    : `${points}/${totalPoints}`;

  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          <span className="font-medium">Chủ đề: {game.topic}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          <span className="font-medium">Thời gian: {displayTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          <span className="font-medium">Điểm: {displayPoints}</span>
        </div>
      </div>
    </Card>
  );
};

export default GameInfoSidebar; 