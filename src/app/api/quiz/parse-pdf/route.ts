import { NextRequest, NextResponse } from "next/server";
import { userQuizSchema } from "@/schemas/form/quizSchema";
import { z } from "zod";

// Regex patterns for parsing
const TITLE_PATTERN = /^([^\n]+)/;
const TOPIC_PATTERN = /^[^\n]+\n([^\n]+)/;
const QUESTION_PATTERN = /Câu\s+(\d+)\.\s*([^?]+\?)/g;
const ANSWER_PATTERN = /([A-D])\.\s*([^\n]+)/g;
const ANSWER_KEY_PATTERN = /(\d+):\s*([A-D])/g;

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

    // Read file content as text
    const text = await file.text();
    const fullText = text;

    // Parse title and topic
    const titleMatch = fullText.match(TITLE_PATTERN);
    const topicMatch = fullText.match(TOPIC_PATTERN);
    
    const title = titleMatch ? titleMatch[1].trim() : "";
    const topic = topicMatch ? topicMatch[1].trim() : "";

    // Parse questions and answers
    const questions: any[] = [];
    let questionMatch;
    const questionMatches = [...fullText.matchAll(QUESTION_PATTERN)];

    for (const match of questionMatches) {
      const questionNumber = parseInt(match[1]);
      const questionText = match[2].trim();
      
      // Find answer options for this question
      const answerSection = fullText.substring(
        match.index!,
        questionMatches[questionMatches.indexOf(match) + 1]?.index || fullText.length
      );
      
      const answerMatches = [...answerSection.matchAll(ANSWER_PATTERN)];
      const choices = answerMatches.map(m => m[2].trim());

      questions.push({
        question: questionText,
        choices,
        correctAnswer: 0, // Will be updated from answer key
      });
    }

    // Parse answer key
    const answerKeyMatches = [...fullText.matchAll(ANSWER_KEY_PATTERN)];
    for (const match of answerKeyMatches) {
      const questionNumber = parseInt(match[1]);
      const correctAnswer = match[2].charCodeAt(0) - 65; // Convert A->0, B->1, etc.
      
      if (questions[questionNumber - 1]) {
        questions[questionNumber - 1].correctAnswer = correctAnswer;
      }
    }

    // Validate against schema
    const quizData = {
      title,
      topic,
      questions,
    };

    const validatedData = userQuizSchema.parse(quizData);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF file" },
      { status: 500 }
    );
  }
} 