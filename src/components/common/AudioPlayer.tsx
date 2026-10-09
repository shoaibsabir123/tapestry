import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw } from 'lucide-react';

interface AudioPlayerProps {
  src?: string;
  duration?: number;
  label?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  duration = 32,
  label = 'Voice Aura Memo'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<any>(null);

  // If real audio src is provided
  useEffect(() => {
    if (src && !audioRef.current) {
      const audio = new Audio(src);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };
      audio.ontimeupdate = () => {
        setCurrentTime(Math.floor(audio.currentTime));
      };
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [src]);

  const togglePlay = () => {
    if (audioRef.current && src) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {
          // Play simulated if audio fails or blocked
          simulatePlay();
        });
        setIsPlaying(true);
      }
    } else {
      simulatePlay();
    }
  };

  const simulatePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            clearInterval(intervalRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Generate 24 decorative soundwave bars
  const waveBars = [
    24, 38, 55, 30, 48, 70, 92, 60, 40, 75, 85, 95, 68, 50, 82, 64, 45, 80, 60, 42, 30, 50, 35, 20
  ];

  return (
    <div className="bg-[#FAF8F5]/80 dark:bg-stone-900/80 border border-stone-200/70 dark:border-stone-800 rounded-xl p-4 flex items-center gap-4 transition-all">
      <button
        onClick={togglePlay}
        className="w-11 h-11 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0 cursor-pointer"
        aria-label={isPlaying ? 'Pause voice memo' : 'Play voice memo'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} className="translate-x-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-serif italic text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Volume2 size={13} className="text-stone-400" />
            {label}
          </span>
          <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        {/* Waveform Visualization */}
        <div className="flex items-center gap-[3px] h-8">
          {waveBars.map((height, i) => {
            const barProgress = (i / waveBars.length) * duration;
            const isPassed = currentTime >= barProgress;
            return (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-300"
                style={{
                  height: isPlaying ? `${Math.max(15, (height * (0.6 + Math.sin(Date.now() / 200 + i) * 0.4)))}%` : `${height}%`,
                  backgroundColor: isPassed
                    ? '#C89D3C'
                    : 'rgba(160, 150, 140, 0.25)'
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
