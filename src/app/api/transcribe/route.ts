import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json({ error: 'DEEPGRAM_API_KEY is not configured' }, { status: 500 });
    }

    const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
    const body = await request.json();
    const { fileName } = body;
    
    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    const audioFilePath = path.join(process.cwd(), 'src/public/audio', fileName);
    
    if (!fs.existsSync(audioFilePath)) {
      return NextResponse.json({ error: `Audio file not found at: ${audioFilePath}` }, { status: 404 });
    }

    const audioBuffer = fs.readFileSync(audioFilePath);
    
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        smart_format: true,
        mimetype: `audio/${path.extname(fileName).slice(1)}`,
      }
    );

    if (error) {
      return NextResponse.json({ error: `Deepgram error: ${error.message}` }, { status: 500 });
    }

    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript found in response' }, { status: 500 });
    }

    return NextResponse.json({ transcript });
    
  } catch (error) {
    return NextResponse.json({ 
      error: `Transcription error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}