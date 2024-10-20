'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SignedIn } from '@clerk/nextjs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Slider } from '@/components/ui/slider';
import { cn } from "@/lib/utils";
import Image from 'next/image';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
    };
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current || duration === 0) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = 'audio.wav';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{formatTime(currentTime)}</span>
        <Slider
          value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleSliderChange}
          max={100}
          step={1}
          className="flex-grow"
        />
        <span className="text-sm font-medium">{formatTime(duration)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={togglePlayPause}>
          {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button variant="outline" onClick={downloadAudio}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
    </div>
  );
};

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendResult, setSendResult] = useState<string>('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [playbackAudio, setPlaybackAudio] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      setRecordingDuration(0);

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
        setFileName(`recording_${Date.now()}.wav`);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setError('');

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('Error accessing microphone. Please check your permissions.');
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendRecording = async () => {
    if (!audioBlob || !fileName) {
      setError('No recording available to send.');
      return;
    }

    setIsSending(true);
    setIsProcessing(true);
    setSendResult('');
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, fileName);

      const response = await fetch('/api/speakandstore', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      setSendResult('Recording processed successfully');
      setPlaybackAudio(data.responseAudioUrl);

    } catch (err) {
      setError('Failed to process audio. Please try again.');
      console.error('Error processing audio:', err);
    } finally {
      setIsSending(false);
      setIsProcessing(false);
    }
  };

  const formatTime = (time: number): string => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <SignedIn>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow relative">
          <Image
            src="/paper.png"
            alt="Paper Background"
            layout="fill"
            objectFit="cover"
            quality={100}
            priority
          />
          <div className="absolute inset-0 flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Recording Card */}
                  <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <h3 className="font-semibold text-lg">Voice Recorder</h3>
                      {isRecording && (
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-sm font-medium">{formatTime(recordingDuration)}</span>
                        </div>
                      )}
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <Button
                          onClick={isRecording ? stopRecording : startRecording}
                          variant={isRecording ? "destructive" : "default"}
                          size="lg"
                          className={cn(
                            "w-full relative overflow-hidden transition-all",
                            isRecording && "animate-pulse"
                          )}
                        >
                          {isRecording ? (
                            <>
                              <Square className="mr-2 h-4 w-4" />
                              Stop Recording
                            </>
                          ) : (
                            <>
                              <Mic className="mr-2 h-4 w-4" />
                              Start Recording
                            </>
                          )}
                        </Button>

                        {audioURL && (
                          <AudioPlayer audioUrl={audioURL} />
                        )}

                        {audioURL && (
                          <Button
                            variant="default"
                            onClick={sendRecording}
                            disabled={isSending || isProcessing}
                            className="w-full"
                          >
                            {isSending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-2 h-4 w-4" />
                            )}
                            Send
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Card */}
                  <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <h3 className="font-semibold text-lg">Response Audio</h3>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      {error && (
                        <Alert variant="destructive" className="mb-4">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      {isProcessing ? (
                        <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                          <p className="text-sm text-gray-500">Processing your audio...</p>
                        </div>
                      ) : (
                        <AudioPlayer audioUrl={playbackAudio || '/output.mp3'} />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </main>
          </div>
        </div>
        <Footer className="text-white bg-black" />
      </div>
    </SignedIn>
  );
};

export default AudioRecorder;