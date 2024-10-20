import { createClient, DeepgramClient } from "@deepgram/sdk";
import * as fs from "fs";

// STEP 1: Create a Deepgram client with your API key
const deepgram: DeepgramClient = createClient(process.env.DEEPGRAM_API_KEY as string);
const text: string = "How are we doing today";

const getAudio = async (): Promise<void> => {
    try {
        // STEP 2: Make a request and configure the request with options
        const response = await deepgram.speak.request(
            { text },
            {
                model: "aura-asteria-en",
                encoding: "linear16",
                container: "wav",
            }
        );

        // STEP 3: Get the audio stream and headers from the response
        const stream = await response.getStream();
        const headers = await response.getHeaders();

        if (stream) {
            // STEP 4: Convert the stream to an audio buffer
            const buffer = await getAudioBuffer(stream);

            // STEP 5: Write the audio buffer to a file
            fs.writeFile("output.wav", buffer, (err) => {
                if (err) {
                    console.error("Error writing audio to file:", err);
                } else {
                    console.log("Audio file written to output.wav");
                }
            });
        } else {
            console.error("Error generating audio: No stream received");
        }

        if (headers) {
            console.log("Headers:", headers);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response: ReadableStream): Promise<Buffer> => {
    const reader = response.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }

    // Calculate the total length of all chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);

    // Create a new Uint8Array with the total length
    const result = new Uint8Array(totalLength);

    // Copy all chunks into the result array
    let position = 0;
    for (const chunk of chunks) {
        result.set(chunk, position);
        position += chunk.length;
    }

    return Buffer.from(result.buffer);
};

getAudio();