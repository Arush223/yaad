import { NextRequest, NextResponse } from 'next/server';
import { createClient, DeepgramClient } from "@deepgram/sdk";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import * as fs from "fs";
import path from 'path';

// Initialize clients
const deepgram: DeepgramClient = createClient(process.env.DEEPGRAM_API_KEY as string);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

// Helper function to convert stream to audio buffer
const getAudioBuffer = async (response: ReadableStream): Promise<Buffer> => {
    const reader = response.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let position = 0;
    for (const chunk of chunks) {
        result.set(chunk, position);
        position += chunk.length;
    }

    return Buffer.from(result.buffer);
};

// Text to Speech function
const textToSpeech = async (text: string): Promise<string> => {
    try {
        const response = await deepgram.speak.request(
            { text },
            {
                model: "aura-asteria-en",
                encoding: "linear16",
                container: "wav",
            }
        );

        const stream = await response.getStream();
        if (stream) {
            const buffer = await getAudioBuffer(stream);
            const outputPath = path.join(process.cwd(), 'public', 'audio', 'output.wav');
            fs.writeFileSync(outputPath, buffer);
            return 'output.wav';
        } else {
            throw new Error("Error generating audio: No stream received");
        }
    } catch (error) {
        console.error("An error occurred in textToSpeech:", error);
        throw error;
    }
};

// Speech to Text function
const speechToText = async (fileName: string): Promise<string> => {
    const audioFilePath = path.join(process.cwd(), 'public', 'audio', fileName);
    
    if (!fs.existsSync(audioFilePath)) {
        throw new Error(`Audio file not found at: ${audioFilePath}`);
    }

    const audioBuffer = fs.readFileSync(audioFilePath);
    
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
        audioBuffer,
        {
            model: 'nova-2',
            smart_format: true,
            mimetype: `audio/${path.extname(fileName).slice(1)}`,
        }
    );

    if (error) {
        throw new Error(`Deepgram error: ${error.message}`);
    }

    const transcript = result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
    if (!transcript) {
        throw new Error('No transcript found in response');
    }

    return transcript;
};

// Vector embedding and classification function
const classifyText = async (text: string) => {
    const moderationResponse = await openai.moderations.create({
        model: "text-moderation-latest",
        input: text,
    });

    if (moderationResponse.results[0].flagged) {
        return { response: 'You entered something inappropriate. Please try again.', examples: '' };
    }

    const embeddings = new OpenAIEmbeddings({
        modelName: "text-embedding-ada-002",
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });

    const retriever = vectorStore.asRetriever({ k: 5 });

    const vectorStoreResponse = await retriever.getRelevantDocuments(text);
    const examples = vectorStoreResponse.map((document) => document.pageContent).join('\n');
    const prompt = `Classify this text: ${text}. Use these as examples: ${examples}. Respond with just the classification. Classify as Top Secret, Secret, For Official Use Only, Unclassified`;

    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
    });

    return { response: response.choices[0].message.content, examples: examples };
};

// Main API route handler
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { inputAudioFileName, text } = body;

        let transcript: string;
        if (inputAudioFileName) {
            // Speech to Text
            transcript = await speechToText(inputAudioFileName);
        } else if (text) {
            transcript = text;
        } else {
            return NextResponse.json({ error: 'Either inputAudioFileName or text is required' }, { status: 400 });
        }

        // Classify text
        const classification = await classifyText(transcript);

        // Generate response using LLM
        const llmResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a helpful assistant. Respond to the user's input based on the given classification." },
                { role: "user", content: `Classification: ${classification.response}\nUser input: ${transcript}` }
            ],
        });

        // Text to Speech
        const outputAudioFileName = await textToSpeech(llmResponse.choices[0].message.content || '');

        return NextResponse.json({
            transcript,
            classification: classification.response,
            llmResponse: llmResponse.choices[0].message.content,
            outputAudioFileName
        });
    } catch (error) {
        console.error('Error in main handler:', error);
        return NextResponse.json({ 
            error: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 500 });
    }
}