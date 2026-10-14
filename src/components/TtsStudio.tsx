import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Play,
  Pause,
  Download,
  Loader2,
  RotateCcw,
  Sliders,
  Type,
  FileAudio,
  History,
  Copy,
  Check,
  Send,
} from 'lucide-react';
import { VOICES } from '../data/storyData';
import { requestTTS, createAudioFromBase64, downloadAudioBase64 } from '../services/ttsService';

interface GeneratedClip {
  id: string;
  text: string;
  voice: string;
  style: string;
  audioBase64: string;
  duration?: number;
  timestamp: string;
}

const PRESET_SCRIPTS = [
  {
    title: 'Tips Izin Aplikasi',
    text: 'Ingat ya teman-teman, sebelum install aplikasi gratis, cek dulu izin yang diminta. Kalau cuma aplikasi senter tapi minta izin kontak dan mic, langsung batalkan!',
    style: 'Santai, akrab seperti tips teman dekat',
  },
  {
    title: 'Intro Podcast Teknologi',
    text: 'Halo semuanya! Selamat datang di Tekno Cerdas. Hari ini kita akan membongkar rahasia di balik aplikasi gratis yang bernilai triliunan rupiah.',
    style: 'Energik, ceria, dan antusias',
  },
  {
    title: 'Edukasi Ekonomi Atensi',
    text: 'Tahukah kamu? Dalam ekonomi digital modern, perhatian dan waktu yang kamu habiskan di layar adalah mata uang yang diperdagangkan ke pengiklan.',
    style: 'Tenang, edukatif, dan jelas',
  },
  {
    title: 'Berita Bisnis Startup',
    text: 'Laporan terbaru menunjukkan model freemium menyumbang lebih dari tujuh puluh persen pertumbuhan pendapatan aplikasi produktivitas tahun ini.',
    style: 'Formal, lugas seperti pembaca berita profesional',
  },
];

const STYLE_OPTIONS = [
  { id: 'warm', label: 'Hangat & Edukatif', prompt: 'Warm, natural, clear educational storyteller in Indonesian' },
  { id: 'enthusiastic', label: 'Antusias & Energik (Kreator)', prompt: 'Enthusiastic, cheerful, dynamic Indonesian creator voice' },
  { id: 'formal', label: 'Formal & Berwibawa (Berita)', prompt: 'Clear, authoritative, professional Indonesian news anchor style' },
  { id: 'casual', label: 'Santai & Akrab (Teman Curhat)', prompt: 'Casual, conversational, friendly Indonesian speaking style' },
  { id: 'dramatic', label: 'Dramatis & Misterius', prompt: 'Intriguing, cinematic, dramatic storytelling voice in Indonesian' },
];

export const TtsStudio: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Aplikasi gratis bukan berarti tidak menghasilkan uang. Tiga kuncinya ada pada pengiklan, pelanggan premium, dan kemitraan dalam aplikasi.'
  );
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [selectedStyle, setSelectedStyle] = useState(STYLE_OPTIONS[0].prompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedClip[]>([]);
  const [copied, setCopied] = useState(false);

  // Active clip playback state
  const [activeClip, setActiveClip] = useState<GeneratedClip | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    setIsGenerating(true);
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }

    try {
      const res = await requestTTS({
        text: inputText.trim(),
        voice: selectedVoice,
        style: selectedStyle,
      });

      const newClip: GeneratedClip = {
        id: `clip_${Date.now()}`,
        text: inputText.trim(),
        voice: selectedVoice,
        style: selectedStyle,
        audioBase64: res.audioBase64,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newClip, ...prev]);
      playClip(newClip);
    } catch (err: any) {
      alert(`Gagal membuat suara TTS: ${err.message || 'Periksa koneksi atau API key'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const playClip = (clip: GeneratedClip) => {
    if (audioElement) {
      audioElement.pause();
    }

    const { audio } = createAudioFromBase64(clip.audioBase64);
    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.ontimeupdate = () => setCurrentTime(audio.currentTime || 0);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    setAudioElement(audio);
    setActiveClip(clip);
    audio.play().catch(console.error);
  };

  const togglePlayActive = () => {
    if (!audioElement && activeClip) {
      playClip(activeClip);
      return;
    }
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play().catch(console.error);
      } else {
        audioElement.pause();
      }
    }
  };

  const handleDownload = (clip: GeneratedClip) => {
    const filename = `${clip.voice}-tts-${clip.text.slice(0, 20)}.wav`;
    downloadAudioBase64(clip.audioBase64, filename);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentVoiceObj = VOICES.find((v) => v.id === selectedVoice) || VOICES[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-7">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          TTS Studio: Bikin Suara AI Baru
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Buat & Unduh Text-to-Audio (gemini-3.8-flash-tts)
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Ketik teks apa saja dalam Bahasa Indonesia, pilih karakter suara dan gaya ekspresi, lalu putar dan langsung download filenya dalam format audio WAV!
        </p>
      </div>

      {/* Quick Presets */}
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Pilih Contoh Skrip Siap Pakai:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_SCRIPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(preset.text);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 transition-colors text-slate-700 text-left font-medium"
            >
              📝 {preset.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <div className="relative">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Type className="w-4 h-4 text-indigo-600" />
              Teks yang Ingin Diubah Jadi Suara:
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopy}
                className="hover:text-slate-800 transition flex items-center gap-1"
                title="Salin teks"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin' : 'Salin'}</span>
              </button>
              <span className="font-mono text-[11px]">{inputText.length} karakter</span>
            </div>
          </div>

          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tuliskan kalimat atau naskah Anda di sini..."
            className="w-full text-sm p-3.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 leading-relaxed transition"
          />
        </div>

        {/* Customization Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          {/* Voice Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              Pilih Narator Suara:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {VOICES.map((v) => (
                <label
                  key={v.id}
                  onClick={() => setSelectedVoice(v.id)}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                    selectedVoice === v.id
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{v.name}</span>
                    <span className={selectedVoice === v.id ? 'text-indigo-200 text-[11px]' : 'text-slate-400 text-[11px]'}>
                      ({v.gender})
                    </span>
                  </div>
                  <span className={selectedVoice === v.id ? 'text-indigo-100 text-[10px]' : 'text-slate-500 text-[10px]'}>
                    {v.tone.split(' ')[0]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              Gaya Bicara / Emosi:
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.prompt)}
                  className={`text-left p-2 rounded-lg border text-xs transition ${
                    selectedStyle === style.prompt
                      ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70'
                  }`}
                >
                  <span className="font-bold block">{style.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-slate-500">
            Model: <strong className="text-indigo-700">gemini-3.8-flash-tts</strong> (Format WAV Asli)
          </span>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !inputText.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menghasilkan Suara AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Buat Suara Audio Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Active Generated Audio Player Card */}
      {activeClip && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg space-y-3 border border-indigo-900/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Audio Siap Diputar
              </span>
              <span className="text-xs text-slate-400">
                Suara: <strong>{activeClip.voice}</strong>
              </span>
            </div>

            {/* Direct Download Button */}
            <button
              onClick={() => handleDownload(activeClip)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition hover:scale-105 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download Audio (.wav)</span>
            </button>
          </div>

          <p className="text-xs text-slate-300 italic line-clamp-2">
            "{activeClip.text}"
          </p>

          {/* Scrubber & Controls */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={togglePlayActive}
              className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white flex items-center justify-center shadow-md transition"
              aria-label={isPlaying ? 'Jeda' : 'Putar'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <span className="text-xs font-mono text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div
              className="flex-1 h-2 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden"
              onClick={(e) => {
                if (audioElement && duration > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const ratio = (e.clientX - rect.left) / rect.width;
                  audioElement.currentTime = ratio * duration;
                }
              }}
            >
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full transition-all duration-100"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-mono text-slate-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* History List */}
      {history.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-600" />
              Riwayat Suara yang Dibuat ({history.length})
            </h4>
            <span className="text-[11px] text-slate-400">Bisa diunduh kapan saja</span>
          </div>

          <div className="space-y-2">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{item.voice}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{item.text}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => playClip(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-semibold border border-slate-200"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Putar</span>
                  </button>

                  <button
                    onClick={() => handleDownload(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-200"
                    title="Download file WAV"
                  >
                    <Download className="w-3 h-3 stroke-[2.5]" />
                    <span>Download WAV</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
