/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      setError('Error accessing microphone. Please check your permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = audioURL;
      a.download = 'recorded_audio.wav';
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      <SignedIn>
        <Navbar />
        {/* Main Container with Background */}
        <div 
          className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/paper.png')" }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Audio Recorder</h1>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-center space-x-4 mb-6">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? 'destructive' : 'default'}
              >
                {isRecording ? <Square className="mr-2" /> : <Mic className="mr-2" />}
                {isRecording ? 'Stop' : 'Start'} Recording
              </Button>
            </div>

            {audioURL && (
              <div className="flex justify-center space-x-4">
                <Button onClick={playRecording} variant="outline">
                  <Play className="mr-2" /> Play
                </Button>
                <Button onClick={downloadRecording} variant="outline">
                  <Download className="mr-2" /> Download
                </Button>
              </div>
            )}
          </div>
        </div>
        <Footer className = 'text-white bg-black'/>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AudioRecorder;
