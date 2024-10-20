import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import fs from 'fs';
import path from 'path';

// Initialize Pinecone client
const initPinecone = async () => {
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    return client;
};
  

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.DEEPGRAM_API_KEY || !process.env.OPENAI_API_KEY || 
        !process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT || 
        !process.env.PINECONE_INDEX_NAME) {
      return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
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
    
    // Transcribe audio
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
    
    // Initialize Pinecone
    const pinecone = await initPinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

    // Initialize OpenAIEmbeddings
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create and store embedding
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
    
    await vectorStore.addDocuments([
      {
        pageContent: transcript,
        metadata: { source: fileName, timestamp: new Date().toISOString() },
      },
    ]);
    
    return NextResponse.json({ 
      transcript,
      message: 'Transcript processed and stored in Pinecone successfully'
    });
    
  } catch (error) {
    return NextResponse.json({
      error: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 });
  }
}