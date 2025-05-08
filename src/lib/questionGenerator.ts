import { strict_output } from "@/lib/cohere";

export const generateQuestions = async (
  amount: number,
  topic: string,
  type: "mcq" | "open_ended"
) => {
  if (type === "open_ended") {
    return await strict_output(
      "You are a helpful AI that is able to generate a pair of question and answers, the length of each answer should not be more than 15 words, store all the pairs of answers and questions in a JSON array. Only return the JSON array.",
      `Generate ${amount} hard open-ended questions about ${topic} in JSON format`,
      {
        question: "question",
        answer: "answer with max length of 15 words",
      }
    );
  } else {
    return await strict_output(
      "You are a helpful AI that generates hard multiple-choice questions. Each question must have one correct answer and three **distinct incorrect options**. Do NOT duplicate the correct answer in the options. The correct answer should only appear in the 'answer' field. Each field should contain a short sentence under 15 words. Return all questions in a JSON array. Only return the JSON array.",
      `Generate ${amount} hard multiple-choice questions about ${topic} in JSON format. Each object must include: 'question', 'answer', 'options1', 'options2', 'options3'.`,
      {
        question: "question",
        answer: "correct answer (under 15 words)",
        options1: "incorrect answer (under 15 words, different from answer)",
        options2: "incorrect answer (under 15 words, different from answer)",
        options3: "incorrect answer (under 15 words, different from answer)",
      }
    );
  }
};
