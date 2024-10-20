import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import path from 'path';

// Initialize Pinecone client
const initPinecone = async () => {
    console.log('Initializing Pinecone client');
    const client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    console.log('Pinecone client initialized');
    return client;
};

export async function POST(request: NextRequest) {
  console.log('1. Starting POST request');
  try {
    // Check for required environment variables
    if (!process.env.DEEPGRAM_API_KEY || !process.env.OPENAI_API_KEY || 
        !process.env.PINECONE_API_KEY || 
        !process.env.PINECONE_INDEX) {
      console.log('2. Missing environment variables');
      return NextResponse.json({ error: 'Missing required environment variables' }, { status: 500 });
    }

    console.log('3. Environment variables checked');

    const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY);
    
    console.log('4. Deepgram client created');

    const formData = await request.formData();
    console.log('5. FormData received:', formData);

    const audioFile = formData.get('audio') as File;
    
    console.log('6. Audio file extracted from FormData');

    if (!audioFile) {
      console.log('7. No audio file found in the request');
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    const fileName = audioFile.name;
    console.log('8. File name:', fileName);

    const audioBuffer = await audioFile.arrayBuffer();
    
    console.log('9. Audio buffer created');

    // Transcribe audio
    console.log('10. Starting Deepgram transcription');
    const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
      Buffer.from(audioBuffer),
      {
        model: 'nova-2',
        smart_format: true,
        mimetype: `audio/${path.extname(fileName).slice(1)}`,
      }
    );
    
    console.log('11. Deepgram transcription completed');

    if (error) {
      console.error('12. Deepgram error:', error);
      return NextResponse.json({ error: `Deepgram error: ${error.message}` }, { status: 500 });
    }
    
    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    
    if (!transcript) {
      console.log('13. No transcript found in Deepgram response');
      return NextResponse.json({ error: 'No transcript found in response' }, { status: 500 });
    }
    
    console.log('14. Transcript extracted:', transcript.substring(0, 100) + '...');

    // Initialize Pinecone
    console.log('15. Initializing Pinecone');
    const pinecone = await initPinecone();
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
    console.log('16. Pinecone index retrieved');

    // Initialize OpenAIEmbeddings
    console.log('17. Initializing OpenAIEmbeddings');
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
    console.log('18. OpenAIEmbeddings initialized');

    // Create and store embedding
    console.log('19. Creating PineconeStore');
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });
    
    console.log('20. Storing document in PineconeStore');
    await vectorStore.addDocuments([
      {
        pageContent: transcript,
        metadata: { source: fileName, timestamp: new Date().toISOString() },
      },
    ]);
    
    console.log('21. Document stored successfully');

    console.log('22. Returning successful response');
    return NextResponse.json({ 
      transcript,
      message: 'Transcript processed and stored in Pinecone successfully'
    });
    
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({
      error: `Processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}