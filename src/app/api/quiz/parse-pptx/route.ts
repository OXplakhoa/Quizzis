import { NextRequest, NextResponse } from "next/server";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { z } from "zod";
import mammoth from "mammoth";

// Define regex patterns for parsing
const titlePattern = /Title:\s*(.+)/i;
const topicPattern = /Topic:\s*(.+)/i;
const questionPattern = /(\d+)\.\s*(.+?)(?=\n\s*[A-D]\.|\n\s*Answer Key:|$)/g;
const answerPattern = /([A-D])\.\s*(.+?)(?=\n\s*[A-D]\.|\n\s*Answer Key:|$)/g;
const answerKeyPattern = /Answer Key:\s*([A-D])/i;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Read file content
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
    const text = result.value;

    // Extract title
    const titleMatch = text.match(titlePattern);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract topic
    const topicMatch = text.match(topicPattern);
    const topic = topicMatch ? topicMatch[1].trim() : "";

    // Extract questions and answers
    const questions: { question: string; answers: string[] }[] = [];
    let questionMatch;
    let currentQuestion: { question: string; answers: string[] } | null = null;

    while ((questionMatch = questionPattern.exec(text)) !== null) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        question: questionMatch[2].trim(),
        answers: []
      };
    }

    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    // Extract answers for each question
    let answerMatch;
    while ((answerMatch = answerPattern.exec(text)) !== null) {
      const answer = answerMatch[2].trim();
      const questionIndex = Math.floor(questions.length * (answerMatch.index / text.length));
      if (questionIndex < questions.length) {
        questions[questionIndex].answers.push(answer);
      }
    }

    // Extract answer key
    const answerKeyMatch = text.match(answerKeyPattern);
    const answerKey = answerKeyMatch ? answerKeyMatch[1] : "";

    // Validate the extracted data
    const quizData = {
      title,
      topic,
      questions: questions.map((q, index) => ({
        question: q.question,
        answers: q.answers,
        correctAnswer: answerKey
      }))
    };

    const validatedData = userQuizSchema.parse(quizData);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Error parsing PPTX:", error);
    return NextResponse.json(
      { error: "Failed to parse PPTX file" },
      { status: 500 }
    );
  }
} 