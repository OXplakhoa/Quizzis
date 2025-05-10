import { Button } from "../ui/button";
import { ChevronRight, Loader2 } from "lucide-react";

interface QuizOptionsProps {
  options: string[];
  selectedChoice: number | null;
  onSelectChoice: (index: number) => void;
  onNext: () => void;
  isChecking: boolean;
}

export const QuizOptions = ({
  options,
  selectedChoice,
  onSelectChoice,
  onNext,
  isChecking,
}: QuizOptionsProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-4">
      {options.map((option, index) => (
        <Button
          onClick={() => onSelectChoice(index)}
          key={index}
          variant={selectedChoice === index ? "default" : "secondary"}
          className="justify-start py-8 mb-4 w-full"
        >
          <div className="flex items-center justify-start">
            <div className="p-2 px-3 mr-5 border rounded-md">{index + 1}</div>
            <div className="text-start">{option}</div>
          </div>
        </Button>
      ))}
      <Button
        onClick={onNext}
        className="mt-2"
        disabled={isChecking || selectedChoice === null}
      >
        {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Next <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}; 