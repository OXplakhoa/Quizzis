import { strict_output } from "@/lib/gpt";
import { quizSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { amount, topic, type } = quizSchema.parse(body);
    let questions:any;
    if (type === "mcq"){
        questions = await strict_output()
    }
    return NextResponse.json({
      hello: "world",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.issues,
        },
        {
          status: 400,
        }
      );
    }
  }
};
