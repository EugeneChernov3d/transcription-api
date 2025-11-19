import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a proofreading assistant. Please proofread the given text and correct any spelling, grammar, and punctuation errors. Return only the corrected text without explanations or formatting.",
        },
        {
          role: "user",
          content: `Please proofread this text: ${text}`,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 1,
      max_tokens: 8192,
    });

    const proofreadText = completion.choices[0]?.message?.content;

    if (!proofreadText) {
      return NextResponse.json(
        { error: "Failed to proofread text" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      originalText: text,
      proofreadText: proofreadText.trim(),
    });
  } catch (error) {
    console.error("Proofreading error:", error);
    return NextResponse.json(
      { error: "Failed to proofread text" },
      { status: 500 }
    );
  }
}
