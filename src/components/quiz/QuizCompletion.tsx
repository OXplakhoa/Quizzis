import { BarChart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn, formatMMSS } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import { useEffect, useState } from "react";

interface QuizCompletionProps {
  gameId: string;
  timeStarted: Date;
  now: Date;
  isOpenEnded?: boolean;
  points?: number;
  totalPoints?: number;
  onFinalTimeUpdate?: (time: string) => void;
}

export const QuizCompletion = ({
  gameId,
  timeStarted,
  now,
  isOpenEnded = false,
  points = 0,
  totalPoints = 0,
  onFinalTimeUpdate
}: QuizCompletionProps) => {
  const [finalTime, setFinalTime] = useState<string>("");

  useEffect(() => {
    const time = formatMMSS(differenceInSeconds(now, timeStarted));
    setFinalTime(time);
    onFinalTimeUpdate?.(time);
  }, [now, timeStarted, onFinalTimeUpdate]);

  const displayPoints = isOpenEnded 
    ? `${points.toFixed(2)}/${totalPoints}`
    : `${points}/${totalPoints}`;

  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
        You completed in {finalTime}
      </div>
      {isOpenEnded && (
        <div className="px-4 mt-2 font-semibold text-white bg-blue-500 rounded-md whitespace-nowrap">
          Final Score: {displayPoints}
        </div>
      )}
      <Link href={`/statistics/${gameId}`} className={cn(buttonVariants(), "mt-2")}>
        View Statistic
        <BarChart className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}; 