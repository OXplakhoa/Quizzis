// /api/game
import { generateQuestions } from "@/lib/questionGenerator";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { quizSchema } from "@/schemas/form/quizSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

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
    console.log("Received request body:", body);

    const { amount, topic, type } = quizSchema.parse(body);
    console.log("Parsed request:", { amount, topic, type });

    // Create game first
    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: session.user.id,
        topic,
      },
    });
    console.log("Created game:", game.id);

    try {
      // Generate questions
      const questions = await generateQuestions(amount, topic, type);
      console.log("Generated questions:", questions.length);

      // Update topic count
      await prisma.topicCount.upsert({
        where: { topic },
        create: { topic, count: 1 },
        update: { count: { increment: 1 } },
      });

      // Create questions based on type
      if (type === "mcq") {
        const manyData = questions.map((question: any) => {
          const options = [
            question.answer,
            question.options1,
            question.options2,
            question.options3,
          ].sort(() => Math.random() - 0.5);

          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            gameId: game.id,
            questionType: "mcq" as const,
          };
        });

        await prisma.question.createMany({ data: manyData });
      } else if (type === "open_ended") {
        const manyData = questions.map((question: any) => ({
          question: question.question,
          answer: question.answer,
          gameId: game.id,
          questionType: "open_ended" as const,
        }));

        await prisma.question.createMany({ data: manyData });
      }

      return NextResponse.json({ gameId: game.id });
    } catch (error) {
      // If question generation fails, delete the game
      await prisma.game.delete({ where: { id: game.id } });
      throw error;
    }
  } catch (error) {
    console.error("Game creation error:", error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
};
