import { Card } from "@/components/ui/card";
import { Question } from "@prisma/client";

type Props = {
  questions: Pick<Question, "id">[];
};

const ProgressSidebar = ({ questions }: Props) => {
  return (
    <Card className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <h3 className="font-semibold mb-4">Tiến độ câu hỏi</h3>
      <div className="space-y-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            <div className="h-2 bg-blue-500 rounded-full" style={{ width: '0%' }} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProgressSidebar; 