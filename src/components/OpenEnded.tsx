"use client";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer, Eye } from "lucide-react";
import React from "react";
import { differenceInSeconds } from "date-fns";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quizSchema";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { cn, formatMMSS } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
  onPointsUpdate: (points: number) => void;
};

const OpenEnded = ({ game, onPointsUpdate }: Props) => {
  const [questionIdx, setQuestionIdx] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [points, setPoints] = React.useState<number>(0);
  const [now, setNow] = React.useState(new Date());
  const [timeStarted] = React.useState(() => new Date());
  const [showSampleAnswer, setShowSampleAnswer] = React.useState(false);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIdx];
  }, [questionIdx, game.questions]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      if (!answer.trim()) {
        throw new Error("Please enter your answer");
      }
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: answer,
      };
      const response = await axios.post("/api/checkAnswer", payload);
      return response.data;
    },
    onSuccess: ({ isCorrect }) => {
      if (isCorrect) {
        toast.success("Đúng rồi!", {
          style: {
            background: "green",
            color: "white",
          },
          description: "Chúc mừng bạn đã làm đúng!",
        });
        setCorrectAnswers((prev) => prev + 1);
        const newPoints = points + 10;
        setPoints(newPoints);
        onPointsUpdate(newPoints);
      } else {
        toast.error("Sai rồi!", {
          style: {
            background: "red",
            color: "white",
          },
          description: "Xin bạn hãy cố gắng hơn nữa!",
        });
        setWrongAnswers((prev) => prev + 1);
      }
      setQuestionIdx((prev) => prev + 1);
      setAnswer("");
      setShowSampleAnswer(false);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const handleNext = React.useCallback(() => {
    if (!answer.trim()) {
      toast.error("Vui lòng nhập câu trả lời!");
      return;
    }
    checkAnswer();
  }, [checkAnswer, answer]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isChecking) return;

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (answer.trim()) {
          handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [answer, isChecking, handleNext]);

  if (!currentQuestion) {
    return (
      <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {formatMMSS(differenceInSeconds(now, timeStarted))}
        </div>
        <Link href={`/statistics/${game.id}`} className={cn(buttonVariants(), "mt-2")}>
          View Statistic
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-slate-800 mr-2">Chủ đề:</span>
            <span className="px-2 py-1 text-white rounded-md bg-slate-800">
              {game.topic}
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
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center">
          <CardTitle className="text-center divide-y divide-zinc-600/50 mr-5">
            <div>{questionIdx + 1}</div>
            <div className="text-base text-slate-400">
              {game.questions.length}
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-lg text-slate-800 font-bold">
            {currentQuestion.question}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex flex-col items-center justify-center w-full mt-4">
        <Textarea
          value={answer}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
          placeholder="Nhập câu trả lời của bạn..."
          className="w-full min-h-[150px] mb-4"
        />
        <div className="flex gap-2">
          <Button
            onClick={handleNext}
            className="mt-2"
            disabled={isChecking || !answer.trim()}
          >
            {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Next <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            onClick={() => setShowSampleAnswer(!showSampleAnswer)}
            variant="outline"
            className="mt-2"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showSampleAnswer ? "Ẩn đáp án mẫu" : "Xem đáp án mẫu"}
          </Button>
        </div>
        {showSampleAnswer && (
          <Card className="w-full mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Đáp án mẫu:</CardTitle>
              <CardDescription className="text-base">
                {currentQuestion.answer}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default OpenEnded;
