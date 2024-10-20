'use client';

import React from 'react';

export default function TestTTS() {
  const testText = "This is a test of the text to speech system.";
  
  const handleTest = async () => {
    try {
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText }),
      });

      if (!response.ok) throw new Error('Failed to generate speech');

      const blob = await response.blob();
      const audio = new Audio(URL.createObjectURL(blob));
      audio.play();
    } catch (error) {
      console.error('Test failed:', error);
      alert('Test failed');
    }
  };

  return (
    <div className="p-4">
      <h1>Text to Speech Test</h1>
      <p>Test text: {testText}</p>
      <button onClick={handleTest} className="mt-4 p-2 bg-blue-500 text-white">
        Run Test
      </button>
    </div>
  );
}