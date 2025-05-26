import { z } from "zod";

export const quizSchema = z.object({
  topic: z
    .string()
    .min(4, "Chủ để phải có ít nhất 4 ký tự")
    .max(50, "Chủ đề không được quá 50 ký tự"),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
});

export const checkAnswerSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});

const baseQuestionSchema = z.object({
  question: z.string().min(4, "Câu hỏi phải có ít nhất 4 ký tự"),
  type: z.enum(["mcq", "open_ended"]),
});

const mcqQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("mcq"),
  choices: z.array(z.string().min(1)).min(2).max(4),
  correctAnswer: z.number().int().min(0),
});

const openEndedQuestionSchema = baseQuestionSchema.extend({
  type: z.literal("open_ended"),
  answer: z.string().min(1, "Đáp án không được để trống"),
});

export const userQuizSchema = z.object({
  title: z.string().min(4, "Tiêu đề phải có ít nhất 4 ký tự").max(100, "Tiêu đề không được quá 100 ký tự"),
  topic: z.string().min(4, "Chủ để phải có ít nhất 4 ký tự").max(50, "Chủ đề không được quá 50 ký tự"),
  questions: z.array(z.discriminatedUnion("type", [mcqQuestionSchema, openEndedQuestionSchema]))
    .min(1, "Phải có ít nhất 1 câu hỏi"),
});
