import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { InlineLoading } from '../ui/loading';
import { Mic, Pause, Play, StopCircle } from 'lucide-react';

interface TranscriptRecordProps {
  onSuccess?: () => void;
}

export const TranscriptRecord: React.FC<TranscriptRecordProps> = ({ onSuccess }) => {
  const { getToken } = useAuth();
  const { refreshData } = useAppContext();
  const navigate = useNavigate();

  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'processing' | 'complete'>('idle');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioLevelRef = useRef<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  useEffect(() => {
    return () => {
      stopTimer();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const formatElapsed = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    const start = Date.now() - elapsedMs;
    stopTimer();
    timerRef.current = window.setInterval(() => {
      setElapsedMs(Date.now() - start);
      setAudioLevel(audioLevelRef.current);
    }, 250);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      setError('');
      setSuccess('');
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);
      const dataArray = new Float32Array(analyser.fftSize);
      const levelLoop = () => {
        if (!analyserRef.current) return;
        // Prefer float time domain if available
        if (typeof analyserRef.current.getFloatTimeDomainData === 'function') {
          analyserRef.current.getFloatTimeDomainData(dataArray);
        } else {
          const intData = new Uint8Array(analyserRef.current.fftSize);
          analyserRef.current.getByteTimeDomainData(intData);
          for (let i = 0; i < intData.length; i++) dataArray[i] = (intData[i] - 128) / 128;
        }
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i];
          sum += v * v;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        audioLevelRef.current = Math.min(1, rms * 3);
        requestAnimationFrame(levelLoop);
      };

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus' : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      mr.onstop = () => {
        stopTimer();
        setRecordingState('processing');
        const blob = new Blob(chunksRef.current, { type: mimeType });
        uploadAudio(blob);
      };

      mr.start(1000);
      setRecordingState('recording');
      setElapsedMs(0);
      startTimer();
      requestAnimationFrame(levelLoop);
    } catch (e: any) {
      setError(e?.message || 'Failed to start recording. Please check microphone permissions.');
      setRecordingState('idle');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingState('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingState('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  };

  const uploadAudio = async (blob: Blob) => {
    try {
      const token = await getToken();
      if (!token) {
        setError('Authentication failed. Please sign in again.');
        setRecordingState('idle');
        return;
      }

      setUploadProgress(15);
      const formData = new FormData();
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type || 'audio/webm' });
      formData.append('audio', file);

      setUploadProgress(40);
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload-audio`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const pct = Math.min(70, Math.round((evt.loaded / evt.total) * 40) + 30);
            setUploadProgress(pct);
          }
        }
      });

      setUploadProgress(95);
      await refreshData();

      setSuccess('Recording transcribed and processed successfully!');
      setUploadProgress(100);
      setRecordingState('complete');

      const { notesId } = res.data;
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(`/notes/${notesId}`);
        }
      }, 1000);
    } catch (err: any) {
      const details = err?.response?.data?.details;
      const msg = err?.response?.data?.error || err?.message || 'Failed to process recording.';
      setError(details ? `${msg} (${details})` : msg);
      setRecordingState('idle');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Record Class</CardTitle>
          <CardDescription className="text-lg">
            Record audio from your microphone and automatically generate notes & quizzes when you stop
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recorder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Mic className={`h-6 w-6 ${recordingState === 'recording' ? 'text-red-600' : 'text-gray-500'}`} />
              </div>
              <div>
                <div className="text-lg font-semibold">{formatElapsed(elapsedMs)}</div>
                <div className="text-xs text-muted-foreground">Audio level</div>
                <div className="w-48 h-2 bg-gray-200 rounded overflow-hidden">
                  <div className="h-2 bg-green-500" style={{ width: `${Math.round(audioLevel * 100)}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {recordingState === 'idle' && (
                <Button onClick={startRecording}>
                  <Mic className="h-4 w-4 mr-2" /> Start
                </Button>
              )}
              {recordingState === 'recording' && (
                <>
                  <Button variant="outline" onClick={pauseRecording}>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </Button>
                  <Button variant="destructive" onClick={stopRecording}>
                    <StopCircle className="h-4 w-4 mr-2" /> Stop
                  </Button>
                </>
              )}
              {recordingState === 'paused' && (
                <>
                  <Button onClick={resumeRecording}>
                    <Play className="h-4 w-4 mr-2" /> Resume
                  </Button>
                  <Button variant="destructive" onClick={stopRecording}>
                    <StopCircle className="h-4 w-4 mr-2" /> Stop
                  </Button>
                </>
              )}
            </div>
          </div>

          {(recordingState === 'processing' || recordingState === 'complete') && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Processing</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {recordingState === 'processing' && (
            <div className="flex items-center text-sm text-muted-foreground">
              <InlineLoading size="sm" className="mr-2" /> Transcribing and generating content...
            </div>
          )}
          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};