import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
}

export const QuestionCard = ({
  questionNumber,
  totalQuestions,
  question,
}: QuestionCardProps) => {
  return (
    <Card className="w-full mt-4">
      <CardHeader className="flex flex-row items-center">
        <CardTitle className="text-center divide-y divide-zinc-600/50 mr-5">
          <div>{questionNumber + 1}</div>
          <div className="text-base text-slate-400">
            {totalQuestions}
          </div>
        </CardTitle>
        <CardDescription className="flex-grow text-lg text-slate-800 font-bold">
          {question}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}; 