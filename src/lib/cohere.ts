export async function strict_output(
  system_prompt: string,
  user_prompt: string,
  output_format: Record<string, string> 
) {
  const COHERE_API_KEY = process.env.COHERE_API_KEY;
  if (!COHERE_API_KEY) throw new Error("Missing COHERE_API_KEY");

  const formatDescription = Object.entries(output_format)
    .map(([key, desc]) => `${key}: ${desc}`)
    .join(", ");

  const fullPrompt = `
${system_prompt}

User prompt: ${user_prompt}

Your output should strictly be a JSON array of objects with the following format:
{ ${formatDescription} }
Only return the JSON array without explanation.
  `.trim();

  const response = await fetch("https://api.cohere.ai/v1/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${COHERE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "command-r-plus",
      message: fullPrompt,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  const data = await response.json();

  try {
    const parsed = JSON.parse(data.text);
    return parsed;
  } catch (e) {
    console.error("Failed to parse response from Cohere:", data.text);
    throw new Error("Cohere output is not a valid JSON");
  }
}
