import { z } from "zod";

export const quizSchema = z.object({
  topic: z
    .string()
    .min(4, "Chủ để phải có ít nhất 4 ký tự")
    .max(50, "Chủ đề không được quá 50 ký tự"),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
});
