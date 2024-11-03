'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Download, Send, Loader2, Volume2 } from 'lucide-react';
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
  audioUrl: string | null;
  label?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, label }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setIsLoading(true);

    const updateTime = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setCurrentTime(0);
      setIsLoading(false);
    };
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;
    
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

  if (!audioUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
        <Volume2 className="h-8 w-8 text-gray-400" />
        <p className="text-sm text-gray-500">No audio available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-xs text-gray-500">Duration: {formatTime(duration)}</span>
        </div>
      )}
      <div className="p-4 rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2 mb-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={togglePlayPause}
            disabled={!audioUrl || isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </>
            )}
          </Button>
          <div className="flex-grow px-2">
            <Slider
              value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
              onValueChange={handleSliderChange}
              max={100}
              step={1}
              disabled={isLoading}
              className="flex-grow"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={downloadAudio}
            disabled={!audioUrl || isLoading}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex justify-between px-2">
          <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
          <span className="text-xs text-gray-500">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [playbackAudio, setPlaybackAudio] = useState<string | null>(null);
  const [recordingDuration, setRecordingDuration] = useState<number>(0);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      audioChunksRef.current = [];
      setRecordingDuration(0);
      setError('');
      setAudioURL(null);
      setPlaybackAudio(null);
      setTranscribedText('');
      setAiResponse('');

      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);

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
    if (!audioURL) {
      setError('No recording available to send.');
      return;
    }

    setIsSending(true);
    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch(audioURL);
      const audioBlob = await response.blob();
      const formData = new FormData();
      formData.append('audio', audioBlob, `recording_${Date.now()}.webm`);

      const serverResponse = await fetch('/api/speakandstore', {
        method: 'POST',
        body: formData,
      });

      if (!serverResponse.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await serverResponse.json();
      setPlaybackAudio(data.responseAudioUrl);
      setTranscribedText(data.transcription || '');
      setAiResponse(data.aiResponse || '');
    } catch (err) {
      setError('Failed to process audio. Please try again.');
      console.error('Error processing audio:', err);
    } finally {
      setIsSending(false);
      setIsProcessing(false);
    }
  };

  const formatTime = (time: number): string => {
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
            fill
            style={{ objectFit: 'cover' }}
            quality={100}
            priority
          />
          <div className="absolute inset-0 flex flex-col backdrop-blur-sm">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
              <div className="max-w-5xl w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recording Card */}
            <Card className="bg-white/95 shadow-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="font-semibold text-lg">Voice Recorder</h3>
                {isRecording && (
            <div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-sm font-medium text-red-600">{formatTime(recordingDuration)}</span>
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
              <>
                <AudioPlayer audioUrl={audioURL} label="Preview Recording" />
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
                  {isSending ? 'Sending...' : 'Send Recording'}
                </Button>
              </>
            )}
            
            {transcribedText && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Transcribed Text:</h4>
                <p className="text-sm text-gray-700">{transcribedText}</p>
              </div>
            )}
                </div>
              </CardContent>
            </Card>

            {/* Response Card */}
            <Card className="bg-white/95 shadow-xl border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <h3 className="font-semibold text-lg">AI Response</h3>
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
            <div className="space-y-6">
              <AudioPlayer audioUrl={playbackAudio} label="AI Response Audio" />
              
              {aiResponse && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">AI Response Text:</h4>
                  <p className="text-sm text-gray-700">{aiResponse}</p>
                </div>
              )}
            </div>
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