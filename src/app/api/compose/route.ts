/**
 * Compose Message API Endpoint
 *
 * Usage:
 * POST /api/compose
 *
 * Request body:
 * { "description": "Description of the message you want to compose" }
 *
 * Response:
 * {
 *   "description": "Original description",
 *   "composedMessage": "Professional, clear, and concise message"
 * }
 *
 * Example:
 * curl -X POST http://localhost:3000/api/compose \
 *   -H "Content-Type: application/json" \
 *   -d '{"description": "I need to tell my team that the meeting is postponed and I will send a new calendar invite soon"}'
 */

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description } = body;

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string" },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional message composer. Based on the user's description, write a clear, concise, and professional message with a positive tone. The message should be well-structured, appropriate for business communication, and maintain a good vibe. Focus on clarity and professionalism while being approachable. Return only the composed message without explanations or additional formatting.",
        },
        {
          role: "user",
          content: `Please compose a professional message based on this description: ${description}`,
        },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.7,
      max_tokens: 8192,
    });

    const composedMessage = completion.choices[0]?.message?.content;

    if (!composedMessage) {
      return NextResponse.json(
        { error: "Failed to compose message" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      description: description,
      composedMessage: composedMessage.trim(),
    });
  } catch (error) {
    console.error("Message composition error:", error);
    return NextResponse.json(
      { error: "Failed to compose message" },
      { status: 500 }
    );
  }
}