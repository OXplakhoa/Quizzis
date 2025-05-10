import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quizSchema";
import { NextResponse } from "next/server";
import { z } from "zod";
import { scoreAnswer } from "@/lib/scoreAnswer";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { questionId, userAnswer } = checkAnswerSchema.parse(body);
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      return NextResponse.json(
        {
          error: "Question not found",
        },
        {
          status: 404,
        }
      );
    }
    await prisma.question.update({
      where: { id: questionId },
      data: {
        userAnswer,
      },
    });

    if (question.questionType === "mcq") {
      const isCorrect =
        question.answer.toLowerCase().trim() ===
        userAnswer.toLowerCase().trim();
      await prisma.question.update({
        where: { id: questionId },
        data: {
          isCorrect,
        },
      });
      return NextResponse.json(
        {
          isCorrect,
        },
        {
          status: 200,
        }
      );
    } else if (question.questionType === "open_ended") {
      const { score, explanation } = await scoreAnswer(userAnswer, question.answer);
      const isCorrect = score >= 7; // Consider answers with 70% or higher similarity as correct
      
      await prisma.question.update({
        where: { id: questionId },
        data: {
          isCorrect,
          percentageCorrect: score * 10, // Store the percentage (0-100)
        },
      });

      return NextResponse.json(
        {
          isCorrect,
          score,
          explanation,
        },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
};
