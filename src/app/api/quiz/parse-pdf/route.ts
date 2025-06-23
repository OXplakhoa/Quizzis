import { NextRequest, NextResponse } from "next/server";
import { userQuizSchema } from "@/schemas/form/quizSchema";

// Improved regex patterns for parsing
const TITLE_PATTERN = /^([^\n]+)/;
const TOPIC_PATTERN = /^[^\n]+\n([^\n]+)/;
const QUESTION_PATTERN = /(?:Câu\s+)?(\d+)\.\s*([^?]+\?)/g;
const ANSWER_PATTERN = /([A-D])\.\s*([^\n]+)/g;
const ANSWER_KEY_PATTERN = /(?:ANSWER KEY|ĐÁP ÁN):\s*\n((?:\d+:\s*[A-D]\n?)+)/i;

// Simple text extraction from PDF-like content
async function extractTextFromFile(file: File): Promise<string> {
  try {
    // First try to read as text (works for some PDFs and text files)
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
    const fullText = await extractTextFromFile(file);
    
    console.log("Extracted text length:", fullText.length); // For debugging

    // Parse title and topic
    const titleMatch = fullText.match(TITLE_PATTERN);
    const topicMatch = fullText.match(TOPIC_PATTERN);
    
    const title = titleMatch ? titleMatch[1].trim() : "Untitled Quiz";
    const topic = topicMatch ? topicMatch[1].trim() : "General";

    // Parse questions and answers
    const questions: any[] = [];
    const questionMatches = [...fullText.matchAll(QUESTION_PATTERN)];

    for (let i = 0; i < questionMatches.length; i++) {
      const match = questionMatches[i];
      const questionNumber = parseInt(match[1]);
      const questionText = match[2].trim();
      
      // Find the section between this question and the next question (or end of text)
      const startIndex = match.index!;
      const endIndex = questionMatches[i + 1]?.index || fullText.length;
      const questionSection = fullText.substring(startIndex, endIndex);
      
      // Extract answer choices for this question
      const answerMatches = [...questionSection.matchAll(ANSWER_PATTERN)];
      const choices = answerMatches.map(m => m[2].trim()).filter(choice => choice.length > 0);

      // Ensure we have at least 2 choices
      if (choices.length >= 2) {
        questions.push({
          question: questionText,
          type: "mcq",
          choices,
          correctAnswer: 0, // Will be updated from answer key
        });
      }
    }

    // Parse answer key
    const answerKeyMatch = fullText.match(ANSWER_KEY_PATTERN);
    if (answerKeyMatch) {
      const answerKeyText = answerKeyMatch[1];
      const answerKeyLines = answerKeyText.split('\n').filter(line => line.trim());
      
      for (const line of answerKeyLines) {
        const keyMatch = line.match(/(\d+):\s*([A-D])/);
        if (keyMatch) {
          const questionNumber = parseInt(keyMatch[1]);
          const correctAnswer = keyMatch[2].charCodeAt(0) - 65; // Convert A->0, B->1, etc.
          
          if (questions[questionNumber - 1]) {
            questions[questionNumber - 1].correctAnswer = correctAnswer;
          }
        }
      }
    }

    // If no questions were parsed, try alternative parsing
    if (questions.length === 0) {
      // Fallback: try to extract any text that looks like questions
      const lines = fullText.split('\n').filter(line => line.trim());
      let currentQuestion: any = null;
      
      for (const line of lines) {
        // Look for question patterns
        const questionMatch = line.match(/(?:Câu\s+)?(\d+)\.\s*(.+)/);
        if (questionMatch) {
          if (currentQuestion && currentQuestion.choices.length >= 2) {
            questions.push(currentQuestion);
          }
          currentQuestion = {
            question: questionMatch[2].trim(),
            type: "mcq",
            choices: [],
            correctAnswer: 0,
          };
        } else if (currentQuestion) {
          // Look for answer choices
          const answerMatch = line.match(/^([A-D])\.\s*(.+)/);
          if (answerMatch) {
            currentQuestion.choices.push(answerMatch[2].trim());
          }
        }
      }
      
      // Add the last question if it has enough choices
      if (currentQuestion && currentQuestion.choices.length >= 2) {
        questions.push(currentQuestion);
      }
    }

    // Validate against schema
    const quizData = {
      title,
      topic,
      questions,
    };

    console.log("Parsed quiz data:", { title, topic, questionCount: questions.length }); // For debugging

    const validatedData = userQuizSchema.parse(quizData);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF file. Please ensure the PDF contains properly formatted questions and answers." },
      { status: 500 }
    );
  }
} 