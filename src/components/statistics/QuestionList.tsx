import { Question } from "@prisma/client";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  TableBody,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
type Props = {
  questions: Question[];
};

const QuestionList = ({ questions }: Props) => {
  let gameType = questions[0].questionType;
  return (
    <Table className="mt-4">
      <TableCaption>Kết thúc bài kiểm tra</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[10px]"></TableHead>
          <TableHead>Câu hỏi & Câu trả lời</TableHead>
          <TableHead>Câu trả lời của bạn</TableHead>
          {gameType === "open_ended" && (
            <TableHead className="w-[10px] text-right">Độ chính xác</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        <>
          {questions.map((question, index) => {
            return (
              <TableRow key={question.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {question.question}
                  <br /> <br />
                  <span className="font-semibold">{question.answer}</span>
                </TableCell>
                {gameType === "mcq" && (
                  <TableCell
                    className={cn(
                      "text-center",
                      question.isCorrect ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {question.isCorrect ? "Đúng" : "Sai"}
                  </TableCell>
                )}
                {gameType === "open_ended" && (
                  <TableCell className="text-blue-900">{question.userAnswer}</TableCell>
                )}
                {gameType === "open_ended" && (
                  <TableCell className="text-right">
                    {question.percentageCorrect}%
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </>
      </TableBody>
    </Table>
  );
};

export default QuestionList;
