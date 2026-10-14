import React from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Loader2, Download } from 'lucide-react';
import { VOICES } from '../data/storyData';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  currentTitle: string;
  selectedVoice: string;
  hasAudio: boolean;
  onTogglePlay: () => void;
  onReplay: () => void;
  onSeek: (seconds: number) => void;
  onChangeSpeed: (speed: number) => void;
  onVoiceChange: (voice: string) => void;
  onDownload: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  isLoading,
  currentTime,
  duration,
  playbackRate,
  currentTitle,
  selectedVoice,
  hasAudio,
  onTogglePlay,
  onReplay,
  onSeek,
  onChangeSpeed,
  onVoiceChange,
  onDownload,
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const currentVoiceObj = VOICES.find((v) => v.id === selectedVoice) || VOICES[0];

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-xl border border-indigo-900/50">
      <div className="flex flex-col gap-3">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
                  AI TTS: gemini-3.8-flash-tts
                </span>
                <span className="text-xs text-slate-400">
                  • Suara: <strong className="text-slate-200">{currentVoiceObj.name}</strong> ({currentVoiceObj.gender})
                </span>
              </div>
              <p className="text-sm font-bold text-white truncate mt-0.5">
                {currentTitle}
              </p>
            </div>
          </div>

          {/* Voice & Speed Quick Switchers & Download */}
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {/* Download Button */}
            <button
              onClick={onDownload}
              disabled={isLoading}
              title="Download rekaman audio format .wav"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xs transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Download Audio</span>
              <span className="text-[10px] font-mono opacity-80">.WAV</span>
            </button>

            {/* Speed Picker */}
            <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60 text-xs">
              {[0.8, 1.0, 1.2, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onChangeSpeed(speed)}
                  className={`px-2 py-1 rounded transition-colors font-mono ${
                    playbackRate === speed
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Voice select */}
            <select
              value={selectedVoice}
              onChange={(e) => onVoiceChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.tone.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress scrub bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <div
            className="relative flex-1 h-2.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              if (duration > 0) {
                onSeek(ratio * duration);
              }
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 rounded-full transition-all duration-100"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
          <span className="text-xs font-mono text-slate-400 w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls and Waveform */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2">
            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              disabled={isLoading}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              aria-label={isPlaying ? 'Jeda Audio' : 'Putar Audio'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Replay */}
            <button
              onClick={onReplay}
              disabled={isLoading || duration === 0}
              className="p-2.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Putar Ulang dari Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              {isLoading
                ? 'Sedang membuat suara AI...'
                : isPlaying
                ? 'Sedang memutar narasi suara...'
                : 'Klik tombol putar untuk mendengarkan atau unduh WAV'}
            </span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="flex items-center gap-1 h-7 px-3 bg-slate-950/60 rounded-lg border border-slate-800">
            <Volume2 className="w-3.5 h-3.5 text-slate-500 mr-1" />
            <span
              className={`w-1 rounded-full transition-all ${
                isPlaying
                  ? 'bg-indigo-400 animate-waveform-1'
                  : 'h-1.5 bg-slate-700'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all ${
                isPlaying
                  ? 'bg-blue-400 animate-waveform-2'
                  : 'h-2 bg-slate-700'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all ${
                isPlaying
                  ? 'bg-emerald-400 animate-waveform-3'
                  : 'h-1.5 bg-slate-700'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all ${
                isPlaying
                  ? 'bg-indigo-400 animate-waveform-4'
                  : 'h-3 bg-slate-700'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all ${
                isPlaying
                  ? 'bg-teal-400 animate-waveform-5'
                  : 'h-1.5 bg-slate-700'
              }`}
            />
            <span
              className={`w-1 rounded-full transition-all ${
                isPlaying
                  ? 'bg-blue-400 animate-waveform-6'
                  : 'h-2 bg-slate-700'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
