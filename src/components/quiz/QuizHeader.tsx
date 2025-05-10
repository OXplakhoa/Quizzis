import { Timer } from "lucide-react";
import { formatMMSS } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";
import MCQCounter from "../MCQCounter";

interface QuizHeaderProps {
  topic: string;
  timeStarted: Date;
  now: Date;
  correctAnswers: number;
  wrongAnswers: number;
}

export const QuizHeader = ({
  topic,
  timeStarted,
  now,
  correctAnswers,
  wrongAnswers,
}: QuizHeaderProps) => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col">
        <p>
          <span className="text-slate-800 mr-2">Chủ đề:</span>
          <span className="px-2 py-1 text-white rounded-md bg-slate-800">
            {topic}
          </span>
        </p>
        <div className="flex self-start mt-3 text-slate-800">
          <Timer className="mr-2" />
          {formatMMSS(differenceInSeconds(now, timeStarted))}
        </div>
      </div>
      <MCQCounter
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
      />
    </div>
  );
}; 