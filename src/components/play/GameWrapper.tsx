"use client";

import React from "react";
import { Game, Question } from "@prisma/client";
import GameLayout from "./GameLayout";
import MCQ from "../MCQ";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const GameWrapper = ({ game }: Props) => {
  const [points, setPoints] = React.useState(0);
  const totalPoints = game.questions.length * 10;

  const handlePointsUpdate = (newPoints: number) => {
    setPoints(newPoints);
  };

  return (
    <GameLayout game={game} points={points} totalPoints={totalPoints}>
      <MCQ game={game} onPointsUpdate={handlePointsUpdate} />
    </GameLayout>
  );
};

export default GameWrapper; 