import QuizCreation from "@/components/QuizCreation";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: {
    topic?: string;
  };
};

export const metadata = {
  title: "Ôn thi trắc nghiệm | Quizzis",
};

const Quiz = async ({searchParams}: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return <QuizCreation topic={searchParams.topic} />;
};

export default Quiz;
