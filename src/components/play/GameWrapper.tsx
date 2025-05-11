"use client";

import React from "react";
import { Game, Question } from "@prisma/client";
import GameLayout from "./GameLayout";
import MCQ from "../MCQ";
import OpenEnded from "../OpenEnded";

type Props = {
  game: Game & { 
    questions: Pick<Question, "id" | "options" | "question" | "answer">[] 
  };
};

const getInitialStartTime = (gameId: string) => {
  if (typeof window !== 'undefined') {
    const persisted = localStorage.getItem(`game_${gameId}_startTime`);
    if (persisted) return new Date(parseInt(persisted));
    const now = new Date();
    localStorage.setItem(`game_${gameId}_startTime`, now.getTime().toString());
    return now;
  }
  return new Date();
};

const GameWrapper = ({ game }: Props) => {
  const [points, setPoints] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [timeStarted] = React.useState<Date>(() => getInitialStartTime(game.id));
  const [now, setNow] = React.useState<Date>(timeStarted);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [finalTime, setFinalTime] = React.useState<string | undefined>();
  const totalPoints = game.questions.length * 10;

  React.useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const handlePointsUpdate = (newPoints: number) => {
    setPoints(newPoints);
  };

  const handleQuestionIndexUpdate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleCompletion = (time: string) => {
    setIsCompleted(true);
    setFinalTime(time);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`game_${game.id}_startTime`);
    }
  };

  return (
    <GameLayout 
      game={game} 
      points={points} 
      totalPoints={totalPoints}
      currentQuestionIndex={currentQuestionIndex}
      now={now}
      timeStarted={timeStarted}
      isCompleted={isCompleted}
      finalTime={finalTime}
      onCompletion={handleCompletion}
    >
      {game.gameType === "mcq" ? (
        <MCQ 
          game={game} 
          onPointsUpdate={handlePointsUpdate} 
          onQuestionIndexUpdate={handleQuestionIndexUpdate}
        />
      ) : (
        <OpenEnded 
          game={game} 
          onPointsUpdate={handlePointsUpdate}
          onQuestionIndexUpdate={handleQuestionIndexUpdate}
          now={now}
          timeStarted={timeStarted}
          isCompleted={isCompleted}
          onCompletion={handleCompletion}
        />
      )}
    </GameLayout>
  );
};

export default GameWrapper; 