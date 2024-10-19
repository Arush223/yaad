import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import fs from 'fs';
import path from 'path';

const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName } = body;
    
    if (!fileName) {
      return NextResponse.json({ error: 'File name is required' }, { status: 400 });
    }

    const audioFilePath = path.resolve('src/public/audio', fileName);
    
    console.log('Attempting to access file:', audioFilePath);

    if (!fs.existsSync(audioFilePath)) {
      return NextResponse.json({ error: `Audio file not found: ${audioFilePath}` }, { status: 404 });
    }

    const audioBuffer = fs.readFileSync(audioFilePath);

    console.log('File size:', audioBuffer.length, 'bytes');
    console.log('File type:', path.extname(fileName));

    const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: 'nova-2',
        smart_format: true,
        mimetype: `audio/${path.extname(fileName).slice(1)}`,
      }
    );

    if (error) {
      console.error('Deepgram API Error:', error);
      return NextResponse.json({ error: `Deepgram API Error: ${error.message || 'Unknown error'}` }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: `Error transcribing audio: ${error instanceof Error ? error.message : 'Unknown error'}` }, { status: 500 });
  }
}

// Add this to explicitly handle other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}