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

const Quiz = async ({ searchParams }: { searchParams: any }) => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect("/");
  }
  const params = typeof searchParams.then === "function" ? await searchParams : searchParams;
  return <QuizCreation topic={params.topic ?? ""} />;
};

export default Quiz;
