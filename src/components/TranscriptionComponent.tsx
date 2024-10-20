'use client';

import React, { useState, useEffect } from 'react';

const TranscriptionComponent = () => {
  interface TranscriptionData {
    text: string;
    // Add other properties that your transcription data might have
  }

  const [transcriptionData, setTranscriptionData] = useState<TranscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState('');
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAvailableFiles(['sample1.wav', 'sample2.mp3', 'sample3.mp3']);
  }, []);

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      console.log('Sending request to /api/transcribe');
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: selectedFile }),
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      setTranscriptionData(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setTranscriptionData(null);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Transcription</h1>
      <div className="mb-4">
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="border rounded p-2 mr-2"
        >
          <option value="">Select a file</option>
          {availableFiles.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
        <button
          onClick={handleTranscribe}
          disabled={isLoading || !selectedFile}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
        </button>
      </div>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      )}
      {transcriptionData && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Transcription Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(transcriptionData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TranscriptionComponent;