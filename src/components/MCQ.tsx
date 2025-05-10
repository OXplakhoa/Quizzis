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
};

const MCQ = ({ game, onPointsUpdate, onQuestionIndexUpdate }: Props) => {
  const {
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
  } = useQuiz(game);

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
        timeStarted={game.timeStarted}
        now={now}
      />
    );
  }

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:w-[80vw] max-w-4xl w-[90vw]">
      <QuizHeader
        topic={game.topic}
        timeStarted={game.timeStarted}
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
