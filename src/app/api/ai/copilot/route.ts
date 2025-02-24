import { generateText } from "ai";
import type { NextRequest } from "next/server";

// import { createOpenAI } from "@ai-sdk/openai";
import { NextResponse } from "next/server";
import { createOllama } from "ollama-ai-provider";
const ollama = createOllama();

export async function POST(req: NextRequest) {
  const { prompt, system } = await req.json();
  console.log(prompt, system);

  try {
    const result = await generateText({
      abortSignal: req.signal,
      model: ollama("llama3.2"),
      prompt: prompt,
      system,
      temperature: 0.7,
    });
    const sanitizedText = result.text?.replace(/<think>[\s\S]*?<\/think>/g, "");

    // Spread the rest of the fields in rawResult, override text
    const sanitizedResult = {
      ...result,
      text: sanitizedText,
    };
    return NextResponse.json(sanitizedResult);
  } catch (error: unknown) {
    console.log("error", error);
    if (error instanceof Error && error.name === "AbortError") {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json(
      { error: "Failed to process AI request" },
      { status: 500 },
    );
  }
}
