import { BarChart } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { cn, formatMMSS } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

interface QuizCompletionProps {
  gameId: string;
  timeStarted: Date;
  now: Date;
}

export const QuizCompletion = ({
  gameId,
  timeStarted,
  now,
}: QuizCompletionProps) => {
  return (
    <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
        You completed in {formatMMSS(differenceInSeconds(now, timeStarted))}
      </div>
      <Link href={`/statistics/${gameId}`} className={cn(buttonVariants(), "mt-2")}>
        View Statistic
        <BarChart className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}; 