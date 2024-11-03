import { NextRequest, NextResponse } from 'next/server';
import { createClient } from "@deepgram/sdk";
import * as fs from "fs";
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const text = body.text || "How are we doing today"; // Default text if none provided

    const deepgram = createClient(process.env.DEEPGRAM_API_KEY as string);

    const response = await deepgram.speak.request(
      { text },
      {
        model: "aura-asteria-en",
        encoding: "linear16",
        container: "wav",
      }
    );

    const stream = await response.getStream();
    if (!stream) {
      throw new Error("No audio stream received");
    }

    // Convert stream to buffer
    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const audioBuffer = new Uint8Array(totalLength);
    let position = 0;
    
    for (const chunk of chunks) {
      audioBuffer.set(chunk, position);
      position += chunk.length;
    }

    // Save to public directory
    const fileName = `audio_${Date.now()}.wav`;
    const publicDir = path.join(process.cwd(), 'public', 'audio');
    
    // Ensure directory exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const filePath = path.join(publicDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(audioBuffer));

    // Return the URL path that can be used by the frontend
    return NextResponse.json({
      success: true,
      audioUrl: `/audio/${fileName}`,
      text: text // Return the text that was converted
    });
    
  } catch (error) {
    console.error("Error generating audio:", error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}