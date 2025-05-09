"use client";
import { Game, Question } from "@prisma/client";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button, buttonVariants } from "./ui/button";
import MCQCounter from "./MCQCounter";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quizSchema";
import axios from "axios";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
  onPointsUpdate: (points: number) => void;
};

const MCQ = ({ game, onPointsUpdate }: Props) => {
  const [questionIdx, setQuestionIdx] = React.useState(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = React.useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = React.useState<number>(0);
  const [points, setPoints] = React.useState<number>(0);

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIdx];
  }, [questionIdx, game.questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion?.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      if (selectedChoice === null) {
        throw new Error("Please select an answer");
      }
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userAnswer: options[selectedChoice],
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
      setSelectedChoice(null);
    },
    onError: (error) => {
      toast.error(error.message || "Có lỗi xảy ra!");
    },
  });

  const handleNext = React.useCallback(() => {
    if (selectedChoice === null) {
      toast.error("Vui lòng chọn một đáp án!");
      return;
    }
    checkAnswer();
  }, [checkAnswer, selectedChoice]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isChecking) return;

      switch (event.key) {
        case "1":
        case "2":
        case "3":
        case "4":
          const index = parseInt(event.key) - 1;
          if (index >= 0 && index < options.length) {
            setSelectedChoice(index);
          }
          break;
        case "Enter":
          if (selectedChoice !== null) {
            handleNext();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedChoice, isChecking, options.length, handleNext]);

  if (!currentQuestion) {
    return (
      <div className="absolute flex flex-col top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="px-4 mt-2 font-semibold text-white bg-green-500 rounded-md whitespace-nowrap">
          You completed in {"3m 4s"}
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
            <span>00:00</span>
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
        {options.map((option, index) => (
          <Button
            onClick={() => setSelectedChoice(index)}
            key={index}
            variant={selectedChoice === index ? "default" : "secondary"}
            className="justify-start py-8 mb-4 w-full"
          >
            <div className="flex items-center justify-start">
              <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
              <div className="text-start">{option}</div>
            </div>
          </Button>
        ))}
        <Button
          onClick={handleNext}
          className="mt-2"
          disabled={isChecking || selectedChoice === null}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
