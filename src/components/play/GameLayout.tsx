import React from "react";
import GameInfoSidebar from "./GameInfoSidebar";
import ProgressSidebar from "./ProgressSidebar";
import { Game, Question } from "@prisma/client";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
  children: React.ReactNode;
  points: number;
  totalPoints: number;
};

const GameLayout = ({ game, children, points, totalPoints }: Props) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-2">
            <GameInfoSidebar game={game} points={points} totalPoints={totalPoints} />
          </div>

          {/* Main Content */}
          <div className="col-span-8">
            {children}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-2">
            <ProgressSidebar questions={game.questions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLayout; 