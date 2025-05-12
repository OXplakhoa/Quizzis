import { NextRequest, NextResponse } from "next/server";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { prisma } from "@/lib/db";
// import { getServerSession } from "next-auth"; // Uncomment if using next-auth

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userQuizSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { title, topic, questions } = parsed.data;

    // TODO: Replace with actual user ID from session
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;
    const userId = "demo-user-id";
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const game = await prisma.game.create({
      data: {
        userId,
        createdBy: userId,
        creator: { connect: { id: userId } },
        title,
        topic,
        gameType: "mcq",
        timeStarted: now,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            options: q.choices,
            answer: q.choices[q.correctAnswer],
            questionType: "mcq",
          })),
        },
      },
    });
    return NextResponse.json({ quizId: game.id });
  } catch (e) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 