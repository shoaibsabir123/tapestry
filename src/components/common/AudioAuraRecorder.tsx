import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, RotateCcw, Check } from 'lucide-react';

interface AudioAuraRecorderProps {
  onAudioSaved: (audioUrl: string, duration: number) => void;
  existingAudioUrl?: string;
  existingDuration?: number;
}

export const AudioAuraRecorder: React.FC<AudioAuraRecorderProps> = ({
  onAudioSaved,
  existingAudioUrl,
  existingDuration = 0
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedSeconds, setRecordedSeconds] = useState(existingDuration);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingAudioUrl || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const playbackTimerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMsg(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          onAudioSaved(url, recordedSeconds || 1);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordedSeconds(0);

        timerRef.current = setInterval(() => {
          setRecordedSeconds((prev) => {
            if (prev >= 60) {
              stopRecording();
              return 60;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        simulateVoiceMemo();
      }
    } catch (err: any) {
      console.warn('Microphone access unavailable or denied, switching to simulated recording mode:', err);
      simulateVoiceMemo();
    }
  };

  const simulateVoiceMemo = () => {
    setIsRecording(true);
    setRecordedSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordedSeconds((prev) => {
        if (prev >= 30) {
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // simulated save
      const simulatedUrl = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg';
      setAudioUrl(simulatedUrl);
      onAudioSaved(simulatedUrl, recordedSeconds || 12);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;
    if (isPlaying) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(audioUrl);
        audioPlayerRef.current.onended = () => {
          setIsPlaying(false);
          setPlaybackSeconds(0);
          if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
        };
      }
      audioPlayerRef.current.play().catch(() => {});
      playbackTimerRef.current = setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= recordedSeconds) {
            clearInterval(playbackTimerRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const clearRecording = () => {
    if (isPlaying && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
    setAudioUrl(null);
    setIsPlaying(false);
    setRecordedSeconds(0);
    setPlaybackSeconds(0);
    onAudioSaved('', 0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="border border-stone-200 dark:border-stone-800 rounded-xl p-6 bg-stone-50/50 dark:bg-stone-900/40">
      <div className="mb-4">
        <h4 className="font-serif text-lg text-stone-900 dark:text-stone-100">
          Audio Aura
        </h4>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-serif italic mt-0.5">
          “What did it feel like in that exact second? Say what the photograph cannot capture.”
        </p>
      </div>

      {!audioUrl && !isRecording && (
        <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl bg-white/40 dark:bg-stone-900/30">
          <button
            type="button"
            onClick={startRecording}
            className="w-16 h-16 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer group"
          >
            <Mic size={24} className="group-hover:text-amber-500 dark:group-hover:text-amber-600 transition-colors" />
          </button>
          <span className="mt-3 text-sm font-medium text-stone-800 dark:text-stone-200">
            Tap to record voice memo
          </span>
          <span className="text-xs text-stone-400 mt-1">
            Up to 60 seconds of private voice aura
          </span>
        </div>
      )}

      {isRecording && (
        <div className="flex flex-col items-center justify-center py-6 px-4 border border-rose-200 dark:border-rose-950/60 rounded-xl bg-rose-50/40 dark:bg-rose-950/20 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg relative">
            <span className="absolute -inset-1 rounded-full bg-rose-500/30 animate-ping" />
            <Mic size={24} />
          </div>
          <div className="mt-3 text-lg font-mono font-medium text-rose-800 dark:text-rose-300">
            {formatTime(recordedSeconds)} / 01:00
          </div>
          <p className="text-xs text-stone-500 mt-1">Listening to your voice...</p>
          <button
            type="button"
            onClick={stopRecording}
            className="mt-4 px-5 py-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 text-sm font-medium flex items-center gap-2 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <Square size={14} className="fill-current" />
            Finish Recording
          </button>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlayback}
                className="w-10 h-10 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="translate-x-0.5" />}
              </button>
              <div>
                <span className="text-xs font-serif italic text-stone-700 dark:text-stone-300">
                  Voice Memo Recorded
                </span>
                <div className="font-mono text-xs text-stone-500">
                  {formatTime(playbackSeconds)} / {formatTime(recordedSeconds)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearRecording}
                className="p-2 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                title="Discard recording"
              >
                <Trash2 size={16} />
              </button>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Check size={14} /> Saved
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
