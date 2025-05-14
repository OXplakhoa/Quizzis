import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";
import { prisma } from "@/lib/db";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { strict_output } from "@/lib/cohere";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to text
    const text = await file.text();
    
    // Use AI to generate questions from the text
    const questions = await strict_output(
      "You are a helpful AI that generates multiple-choice questions from text content. Each question must have one correct answer and three distinct incorrect options. The correct answer should only appear in the 'answer' field. Each field should contain a short sentence under 15 words. Return all questions in a JSON array.",
      `Generate 5 multiple-choice questions from this text: ${text}`,
      {
        question: "question",
        answer: "correct answer (under 15 words)",
        options1: "incorrect answer (under 15 words, different from answer)",
        options2: "incorrect answer (under 15 words, different from answer)",
        options3: "incorrect answer (under 15 words, different from answer)",
      }
    );

    // Format questions according to our schema
    const formattedQuestions = questions.map((q: any) => ({
      question: q.question,
      choices: [q.answer, q.options1, q.options2, q.options3].sort(() => Math.random() - 0.5),
      correctAnswer: 0, // Will be updated after sorting
    }));

    // Update correctAnswer index after sorting
    formattedQuestions.forEach((q: any) => {
      q.correctAnswer = q.choices.indexOf(q.choices.find((c: string) => c === q.answer));
    });

    // Create a temporary quiz in the database
    const quiz = await prisma.game.create({
      data: {
        userId: session.user.id,
        createdBy: session.user.id,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        topic: "Imported from PDF",
        gameType: "mcq",
        timeStarted: new Date(),
        questions: {
          create: formattedQuestions.map((q: any) => ({
            question: q.question,
            options: q.choices,
            answer: q.choices[q.correctAnswer],
            questionType: "mcq",
          })),
        },
      },
    });

    return NextResponse.json({ quizId: quiz.id });
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF" },
      { status: 500 }
    );
  }
} 