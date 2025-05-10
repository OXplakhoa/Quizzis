import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

type ScoreResult = {
  score: number;
  explanation: string;
};

export const scoreAnswer = async (
  userAnswer: string,
  modelAnswer: string
): Promise<ScoreResult> => {
  try {
    // Get embeddings for both answers
    const response = await cohere.embed({
      texts: [userAnswer, modelAnswer],
      model: "embed-english-v3.0",
      inputType: "search_document",
    });

    const embeddings = response.embeddings as number[][];
    if (!embeddings || embeddings.length !== 2) {
      throw new Error("Failed to get embeddings");
    }

    // Calculate cosine similarity
    const similarity = calculateCosineSimilarity(embeddings[0], embeddings[1]);

    // Convert similarity to score based on requirements
    let score: number;
    let explanation: string;

    if (similarity >= 0.85) {
      // Very close to model answer or semantically equivalent
      score = 10;
      explanation = "Câu trả lời của bạn rất chính xác và đầy đủ!";
    } else if (similarity >= 0.7) {
      // Different wording but same meaning
      score = 10;
      explanation = "Câu trả lời của bạn có ý nghĩa tương đương với đáp án mẫu!";
    } else if (similarity >= 0.5) {
      // Partially correct
      score = 5;
      explanation = "Câu trả lời của bạn đúng một phần, cần bổ sung thêm thông tin.";
    } else {
      // Completely wrong
      score = 0;
      explanation = "Câu trả lời của bạn chưa chính xác.";
    }

    return {
      score,
      explanation,
    };
  } catch (error) {
    console.error("Error scoring answer:", error);
    return {
      score: 0,
      explanation: "Có lỗi xảy ra khi chấm điểm.",
    };
  }
};

// Helper function to calculate cosine similarity
function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
} 