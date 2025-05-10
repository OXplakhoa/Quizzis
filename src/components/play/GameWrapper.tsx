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

const GameWrapper = ({ game }: Props) => {
  const [points, setPoints] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const totalPoints = game.questions.length * 10;

  const handlePointsUpdate = (newPoints: number) => {
    setPoints(newPoints);
  };

  const handleQuestionIndexUpdate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <GameLayout 
      game={game} 
      points={points} 
      totalPoints={totalPoints}
      currentQuestionIndex={currentQuestionIndex}
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
        />
      )}
    </GameLayout>
  );
};

export default GameWrapper; 