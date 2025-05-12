import AccuracyCard from "@/components/statistics/AccuracyCard";
import ResultCard from "@/components/statistics/ResultCard";
import TimetakenCard from "@/components/statistics/TimetakenCard";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    gameId: string;
  };
};

const StatisticsPage = async ({ params }: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const game = await prisma.game.findUnique({
    where: {
      id: params.gameId,
    },
    include: {
      questions: true,
    },
  });
  if (!game) {
    return redirect("/");
  }
  let accuracy:number = 0;
  if (game.gameType === "mcq") {
    accuracy = game.questions.reduce((acc, question) => {
      return acc + (question.isCorrect ? 1 : 0);
    }, 0) / game.questions.length * 100;
  }else if (game.gameType === "open_ended") {
    let totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0)
    accuracy = totalPercentage / game.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;
  return (
    <>
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Tổng kết</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className={buttonVariants()}>
              <LucideLayoutDashboard className="mr-2" />
              Trở về trang chủ
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-7">
          <ResultCard accuracy={accuracy} />
          <AccuracyCard accuracy={accuracy} />
          <TimetakenCard timeEnded={new Date()} timeStarted={new Date()}/>
        </div>
        {/* <QuestionsList questions={game.questions} /> */}
      </div>
    </>
  );
};

export default StatisticsPage;
