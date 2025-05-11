import React from 'react';
import { Progress } from './ui/progress';
import * as stringSimilarity from 'string-similarity';

type Props = {
  userAnswer: string;
  correctAnswer: string;
};

const OpenEndedPercentage = ({ userAnswer, correctAnswer }: Props) => {
  const similarity = React.useMemo(() => {
    if (!userAnswer.trim() || !correctAnswer.trim()) return 0;
    return stringSimilarity.compareTwoStrings(userAnswer.toLowerCase(), correctAnswer.toLowerCase());
  }, [userAnswer, correctAnswer]);

  const percentage = Math.round(similarity * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-2xl font-bold text-slate-800">
        {percentage}%
      </div>
      <Progress value={percentage} className="w-full h-2" />
      <div className="text-sm text-slate-500">
        Độ tương đồng với đáp án
      </div>
    </div>
  );
};

export default OpenEndedPercentage;