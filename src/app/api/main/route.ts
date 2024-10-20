// api/main/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { convertAudioToText } from '../services/deepgramService';
import { createEmbeddings } from '../services/embeddingService';
import { storeTextInPinecone, searchPinecone } from '../services/pineconeService';
import { generateResponseWithRAG } from '../services/ragService';
import dotenv from 'dotenv';
import { Buffer } from 'buffer';

const audioBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAADAwAAABAAgAZGF0YQAAAAA='; // Base64-encoded silence audio

dotenv.config();

export const GET = async () => {
  console.log('\nRunning Service Tests...');

  try {
    // 1. Test Deepgram Service
    const testAudioBlob = new Blob([Buffer.from(audioBase64, 'base64')], { type: 'audio/wav' });
    const transcript = await convertAudioToText(testAudioBlob);
    console.log('Deepgram Service:', transcript);

    // 2. Test Embedding Service
    const testText = 'This is a test string.';
    const embeddings = await createEmbeddings(testText);
    console.log('Embedding Service:', embeddings);

    // 3. Test Pinecone Storage
    const testEmbeddings = [0.1, 0.2, 0.3];
    await storeTextInPinecone(testText, testEmbeddings);
    const searchResult = await searchPinecone(testEmbeddings);
    console.log('Pinecone Search Result:', searchResult);
  } catch (err) {
    console.error('Error running tests:', err);
  }

  return NextResponse.json({ message: 'Service tests executed' });
};


export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      console.error('No audio file received');
      return NextResponse.json({ error: 'No audio file received' }, { status: 400 });
    }

    // 1. Convert audio to text using Deepgram
    let transcript;
    try {
      transcript = await convertAudioToText(audioFile);
    } catch (err) {
      console.error('Error converting audio to text:', err);
      return NextResponse.json({ error: 'Failed to convert audio to text' }, { status: 500 });
    }

    // 2. Create vector embeddings for the transcribed text
    let embeddings;
    try {
      embeddings = await createEmbeddings(transcript);
    } catch (err) {
      console.error('Error creating embeddings:', err);
      return NextResponse.json({ error: 'Failed to create embeddings' }, { status: 500 });
    }

    // 3. Store text and embeddings in Pinecone
    try {
      await storeTextInPinecone(transcript, embeddings);
    } catch (err) {
      console.error('Error storing data in Pinecone:', err);
      return NextResponse.json({ error: 'Failed to store data in Pinecone' }, { status: 500 });
    }

    // 4. Perform RAG to generate a response
    let ragResult;
    try {
      ragResult = await generateResponseWithRAG(transcript);
    } catch (err) {
      console.error('Error generating RAG response:', err);
      return NextResponse.json({ error: 'Failed to generate response with RAG' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Audio processed successfully',
      transcript,
      ragResult,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
