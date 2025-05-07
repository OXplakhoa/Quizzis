import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  systemPrompt: string,
  userPrompt: string | string[],
  outputFormat: OutputFormat,
  defaultCategory: string = "",
  outputValueOnly: boolean = false,
  model: string = "gpt-3.5-turbo",
  temperature: number = 1,
  numTries: number = 3,
  verbose: boolean = false
): Promise<
  {
    question: string;
    answer: string;
  }[]
> {
  const isListInput = Array.isArray(userPrompt);
  const hasDynamic = /<.*?>/.test(JSON.stringify(outputFormat));
  const hasListOutput = /\[.*?\]/.test(JSON.stringify(outputFormat));
  let errorMsg = "";

  for (let i = 0; i < numTries; i++) {
    let formatHint = `\nOutput ${
      hasListOutput ? "an array of objects in" : ""
    } JSON format matching: ${JSON.stringify(outputFormat)}.`;
    formatHint += `\nAvoid extra quotes or escaped characters.`;
    if (hasDynamic) {
      formatHint += `\nFields enclosed in < > are placeholders and must be replaced.`;
    }
    if (isListInput) {
      formatHint += `\nReturn a JSON array, one object per input.`;
    }

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt + outputFormat + errorMsg,
      },
      {
        role: "user",
        content: userPrompt.toString(),
      },
    ];

    try {
      const completion = await openai.chat.completions.create({
        model,
        temperature,
        messages,
      });

      let resultText = completion.choices[0].message?.content ?? "";
      resultText = resultText.replace(/'/g, '"'); // fix invalid JSON
      resultText = resultText.replace(/(\w)"(\w)/g, "$1'$2"); // fix over-correction

      if (verbose) {
        console.log("System prompt:", messages[0].content);
        console.log("User prompt:", messages[1].content);
        console.log("Raw response:", resultText);
      }

      let parsed = JSON.parse(resultText);
      const resultArray = Array.isArray(parsed) ? parsed : [parsed];

      for (let entry of resultArray) {
        for (const key in outputFormat) {
          if (/<.*?>/.test(key)) continue;
          if (!(key in entry)) throw new Error(`${key} missing in response.`);

          const expected = outputFormat[key];
          if (Array.isArray(expected)) {
            const choices = expected;
            if (Array.isArray(entry[key])) entry[key] = entry[key][0];

            if (!choices.includes(entry[key]) && defaultCategory) {
              entry[key] = defaultCategory;
            }

            if (typeof entry[key] === "string" && entry[key].includes(":")) {
              entry[key] = entry[key].split(":")[0];
            }
          }
        }

        if (outputValueOnly) {
          const values = Object.values(entry);
          entry = values.length === 1 ? values[0] : values;
        }
      }

      return isListInput ? resultArray : resultArray[0];
    } catch (err: any) {
      errorMsg = `\n\nResponse: ${err.message || "unknown"}\n\nRetrying...`;
      console.error("Error parsing response:", err.message);
    }
  }

  return [];
}
