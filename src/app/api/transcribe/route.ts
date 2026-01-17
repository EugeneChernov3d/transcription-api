/**
 * Transcription API Endpoint
 *
 * Usage:
 * POST /api/transcribe
 *
 * Request body (multipart/form-data):
 * - file: Audio file to transcribe
 *
 * Response:
 * { "text": "Transcribed text" }
 *
 * Example:
 * curl -X POST http://localhost:3000/api/transcribe \
 *   -F "file=@audio.mp3"
 */

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file") as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-large-v3",
      temperature: 0,
      response_format: "verbose_json",
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
