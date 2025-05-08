// /api/game

import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizSchema } from "@/schemas/form/quizSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import axios from "axios";

export const POST = async (req: Request, res: Response) => {
  try {
    const session = await getAuthSession();
    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Bạn cần phải đăng nhập để tham gia trò chơi này",
        },
        {
          status: 401,
        }
      );
    }
    const body = await req.json();
    const { amount, topic, type } = quizSchema.parse(body);
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    const { data } = await axios.post(`${process.env.API_URL}/api/questions`, {
      amount,
      topic,
      type,
    });
    if (type === "mcq") {
      type mcqQuestion = {
        question: string;
        answer: string;
        options1: string;
        options2: string;
        options3: string;
      };
      let manyData = data.questions.map((question: mcqQuestion) => {
        let options = [
          question.answer,
          question.options1,
          question.options2,
          question.options3,
        ];
        options = options.sort(() => Math.random() - 0.5);
        return {
          question: question.question,
          answer: question.answer,
          options: JSON.stringify(options),
          gameId: game.id,
          questionType: "mcq",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    } else if (type === "open_ended") {
      type OpenQuestion = {
        question: string;
        answer: string;
      };
      let manyData = data.questions.map((question: OpenQuestion) => {
        return {
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: "open_ended",
        };
      });
      await prisma.question.createMany({
        data: manyData,
      });
    }
    return NextResponse.json({
      gameId: game.id,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
