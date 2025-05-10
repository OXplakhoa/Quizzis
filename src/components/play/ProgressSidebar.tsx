import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Question } from "@prisma/client";

type Props = {
  questions: Pick<Question, "id">[];
  currentQuestionIndex: number;
};

const ProgressSidebar = ({ questions, currentQuestionIndex }: Props) => {
  const isCompleted = currentQuestionIndex >= questions.length;
  const progress = isCompleted ? 100 : (currentQuestionIndex / questions.length) * 100;

  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <h3 className="font-semibold mb-4">Tiến độ câu hỏi</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Câu hỏi {isCompleted ? questions.length : currentQuestionIndex + 1} / {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="space-y-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                index < currentQuestionIndex 
                  ? "bg-green-500" 
                  : index === currentQuestionIndex && !isCompleted
                  ? "bg-blue-500" 
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressSidebar; 