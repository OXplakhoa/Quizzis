import { NextRequest, NextResponse } from "next/server";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { z } from "zod";

// Define regex patterns for parsing
const titlePattern = /Title:\s*(.+)/i;
const topicPattern = /Topic:\s*(.+)/i;
const questionPattern = /(\d+)\.\s*(.+?)(?=\n\s*[A-D]\.|\n\s*Answer Key:|$)/g;
const answerPattern = /([A-D])\.\s*(.+?)(?=\n\s*[A-D]\.|\n\s*Answer Key:|$)/g;
const answerKeyPattern = /Answer Key:\s*([A-D])/i;

// Simple text extraction from PPTX-like content
async function extractTextFromFile(file: File): Promise<string> {
  try {
    // First try to read as text (works for some files)
    const text = await file.text();
    
    // If it looks like readable text, return it
    if (text.length > 100 && text.includes('.')) {
      return text;
    }
    
    // If not readable text, try to extract from buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Simple text extraction from buffer
    let extractedText = '';
    for (let i = 0; i < buffer.length; i++) {
      const byte = buffer[i];
      // Only include printable ASCII characters and common UTF-8 characters
      if ((byte >= 32 && byte <= 126) || byte === 10 || byte === 13 || byte === 9) {
        extractedText += String.fromCharCode(byte);
      }
    }
    
    return extractedText;
  } catch (error) {
    console.error('Text extraction failed:', error);
    throw new Error('Unable to extract text from file');
  }
}

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

    // Extract text from file using our simple method
    const text = await extractTextFromFile(file);

    // Extract title
    const titleMatch = text.match(titlePattern);
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Quiz";

    // Extract topic
    const topicMatch = text.match(topicPattern);
    const topic = topicMatch ? topicMatch[1].trim() : "General";

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
        type: "mcq",
        choices: q.answers,
        correctAnswer: answerKey.charCodeAt(0) - 65 // Convert A->0, B->1, etc.
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