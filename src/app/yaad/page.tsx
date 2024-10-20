'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion'; // For animations
import { Slider } from '@/components/ui/slider';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    const updateTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    });
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
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

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopPlayback = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current || duration === 0) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const downloadRecording = () => {
    if (audioURL) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = audioURL;
      a.download = 'recorded_audio.wav';
      a.click();
      document.body.removeChild(a);
    }
  };

  const formatTime = (time: number): string => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <SignedIn>
        <Navbar />
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
              <div className="space-y-4">
                <div className="flex justify-center space-x-4">
                  <Button onClick={togglePlayPause} variant="outline">
                    {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  <Button onClick={stopPlayback} variant="outline">
                    <Square className="mr-2" /> Stop
                  </Button>
                  <Button onClick={downloadRecording} variant="outline">
                    <Download className="mr-2" /> Download
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{formatTime(currentTime)}</span>
                  <Slider
                    value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={1}
                    className="flex-grow"
                  />
                  <span className="text-sm">{formatTime(duration)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer className="text-white bg-black" />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default AudioRecorder;