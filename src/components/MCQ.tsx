"use client";
import { Game, Question } from "@prisma/client";
import React, { useEffect } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { QuizHeader } from "./quiz/QuizHeader";
import { QuestionCard } from "./quiz/QuestionCard";
import { QuizOptions } from "./quiz/QuizOptions";
import { QuizCompletion } from "./quiz/QuizCompletion";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
  onPointsUpdate: (points: number) => void;
  onQuestionIndexUpdate: (index: number) => void;
  now: Date;
  onCompletion: (time: string) => void;
};

const MCQ = ({ game, onPointsUpdate, onQuestionIndexUpdate, now, onCompletion }: Props) => {
  const [timeStarted] = React.useState(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const persistedStartTime = localStorage.getItem(`game_${game.id}_startTime`);
      if (persistedStartTime) {
        return new Date(parseInt(persistedStartTime));
      }
    }
    return new Date();
  });
  const {
    questionIdx,
    selectedChoice,
    setSelectedChoice,
    correctAnswers,
    wrongAnswers,
    points,
    isCompleted,
    currentQuestion,
    options,
    isChecking,
    handleNext,
  } = useQuiz(game, timeStarted, onCompletion);

  

  useEffect(() => {
    onQuestionIndexUpdate(questionIdx);
  }, [questionIdx, onQuestionIndexUpdate]);

  useEffect(() => {
    onPointsUpdate(points);
  }, [points, onPointsUpdate]);

  useEffect(() => {
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
  }, [selectedChoice, isChecking, options.length, handleNext, setSelectedChoice]);

  if (!currentQuestion) {
    return (
      <QuizCompletion
        gameId={game.id}
        timeStarted={timeStarted}
        now={now}
      />
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <QuizHeader
        topic={game.topic}
        timeStarted={timeStarted}
        now={now}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
      />
      
      <QuestionCard
        questionNumber={questionIdx}
        totalQuestions={game.questions.length}
        question={currentQuestion.question}
      />

      <QuizOptions
        options={options}
        selectedChoice={selectedChoice}
        onSelectChoice={setSelectedChoice}
        onNext={handleNext}
        isChecking={isChecking}
      />
    </div>
  );
};

export default MCQ;
