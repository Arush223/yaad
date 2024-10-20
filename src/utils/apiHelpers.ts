// utils/apiHelpers.ts

import { createClient } from '@deepgram/sdk';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import path from 'path';

// Check environment variables
export const checkEnvVariables = () => {
  const missingVars = [];
  if (!process.env.DEEPGRAM_API_KEY) missingVars.push("DEEPGRAM_API_KEY");
  if (!process.env.OPENAI_API_KEY) missingVars.push("OPENAI_API_KEY");
  if (!process.env.PINECONE_API_KEY) missingVars.push("PINECONE_API_KEY");
  if (!process.env.PINECONE_ENVIRONMENT) missingVars.push("PINECONE_ENVIRONMENT");
  if (!process.env.PINECONE_INDEX_NAME) missingVars.push("PINECONE_INDEX_NAME");

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
};

// Initialize Pinecone client
export const initPinecone = async () => {
  const client = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return client;
};

// Transcribe audio using Deepgram
export const transcribeAudio = async (audioBuffer: ArrayBuffer, fileName: string) => {
  const deepgramClient = createClient(process.env.DEEPGRAM_API_KEY!);
  const { result, error } = await deepgramClient.listen.prerecorded.transcribeFile(
    Buffer.from(audioBuffer),
    {
      model: 'nova-2',
      smart_format: true,
      mimetype: `audio/${path.extname(fileName).slice(1)}`,
    }
  );

  if (error) throw new Error(`Deepgram error: ${error.message}`);

  const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
  if (!transcript) throw new Error('No transcript found in Deepgram response');
  
  return transcript;
};

// Store transcript in Pinecone
export const storeInPinecone = async (transcript: string, fileName: string) => {
  const pinecone = await initPinecone();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME!);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex });

  await vectorStore.addDocuments([
    {
      pageContent: transcript,
      metadata: { source: fileName, timestamp: new Date().toISOString() },
    },
  ]);
};
