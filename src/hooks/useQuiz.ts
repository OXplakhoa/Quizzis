import { Game, Question } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { checkAnswerSchema } from "@/schemas/form/quizSchema";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useMemo } from "react";

export const useQuiz = (game: Game & { questions: Pick<Question, "id" | "options" | "question">[] }) => {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [now, setNow] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = useMemo(() => {
    return game.questions[questionIdx];
  }, [questionIdx, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion?.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  useEffect(() => {
    if (!currentQuestion) {
      setIsCompleted(true);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (isCompleted) return;
    
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

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

  const handleNext = useCallback(() => {
    if (selectedChoice === null) {
      toast.error("Vui lòng chọn một đáp án!");
      return;
    }
    checkAnswer();
  }, [checkAnswer, selectedChoice]);

  return {
    questionIdx,
    selectedChoice,
    setSelectedChoice,
    correctAnswers,
    wrongAnswers,
    points,
    now,
    isCompleted,
    currentQuestion,
    options,
    isChecking,
    handleNext,
  };
}; 