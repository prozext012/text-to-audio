/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Sparkles,
  Play,
  Pause,
  Loader2,
  HelpCircle,
  Shield,
  DollarSign,
  Layers,
  ArrowRight,
  Headphones,
  CheckCircle2,
  Download,
  Mic,
  Share2,
} from 'lucide-react';
import { Header } from './components/Header';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { StorySectionCard } from './components/StorySectionCard';
import { MonetizationSimulator } from './components/MonetizationSimulator';
import { PrivacyAuditSection } from './components/PrivacyAuditSection';
import { MysteryCommentBoard } from './components/MysteryCommentBoard';
import { TtsStudio } from './components/TtsStudio';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';
import {
  STORY_SECTIONS,
  FULL_STORY_SCRIPT,
  StorySection,
  VOICES,
} from './data/storyData';
import { requestTTS, createAudioFromBase64, downloadAudioBase64 } from './services/ttsService';

export default function App() {
  // Voice selection state
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [activeTab, setActiveTab] = useState<'story' | 'tts-studio' | 'simulator' | 'privacy' | 'comment'>('story');
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [currentPlayingId, setCurrentPlayingId] = useState<string>('full');
  const [currentTitle, setCurrentTitle] = useState('Narasi Penuh: Rahasia Aplikasi Gratis');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cached audio items
  const audioCacheRef = useRef<Map<string, { audio: HTMLAudioElement; url: string; base64: string }>>(new Map());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
    };
  }, []);

  // Sync audio event listeners
  const attachAudioListeners = (audio: HTMLAudioElement) => {
    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 0);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime || 0);
      setDuration(audio.duration || 0);
    };

    audio.onplay = () => {
      setIsPlaying(true);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
      setIsLoading(false);
      setErrorMessage('Terjadi kendala saat memutar audio. Silakan coba lagi.');
    };
  };

  // Play a piece of text with TTS
  const playAudioForText = async (text: string, trackId: string, title: string) => {
    setErrorMessage(null);

    // If already playing this track, toggle play/pause
    if (currentPlayingId === trackId && currentAudioRef.current) {
      if (!currentAudioRef.current.paused) {
        currentAudioRef.current.pause();
        return;
      } else {
        currentAudioRef.current.play().catch(console.error);
        return;
      }
    }

    // Stop current audio if playing
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
    }

    const cacheKey = `${selectedVoice}_${trackId}`;

    // Check if we have this audio cached in memory
    if (audioCacheRef.current.has(cacheKey)) {
      const cached = audioCacheRef.current.get(cacheKey)!;
      currentAudioRef.current = cached.audio;
      currentAudioRef.current.playbackRate = playbackRate;
      attachAudioListeners(cached.audio);
      setCurrentPlayingId(trackId);
      setCurrentTitle(title);
      cached.audio.currentTime = 0;
      cached.audio.play().catch(console.error);
      return;
    }

    // Request new audio from gemini-3.8-flash-tts
    setIsLoading(true);
    setCurrentPlayingId(trackId);
    setCurrentTitle(title);

    try {
      const res = await requestTTS({
        text,
        voice: selectedVoice,
        style: 'Warm, natural, engaging Indonesian voice narrator explaining tech economics',
      });

      const { audio, url, base64 } = createAudioFromBase64(res.audioBase64);
      audioCacheRef.current.set(cacheKey, { audio, url, base64 });
      currentAudioRef.current = audio;
      currentAudioRef.current.playbackRate = playbackRate;
      attachAudioListeners(audio);

      await audio.play();
    } catch (err: any) {
      console.error('TTS Error:', err);
      setErrorMessage(err.message || 'Gagal memuat suara AI');
    } finally {
      setIsLoading(false);
    }
  };

  // Play full story
  const handlePlayFullStory = () => {
    playAudioForText(FULL_STORY_SCRIPT, 'full', 'Narasi Penuh: Rahasia Aplikasi Gratis');
  };

  // Play single section
  const handlePlaySection = (section: StorySection) => {
    playAudioForText(section.scriptText, section.id, section.title);
  };

  // Download section audio
  const handleDownloadSection = async (section: StorySection) => {
    const cacheKey = `${selectedVoice}_${section.id}`;
    if (audioCacheRef.current.has(cacheKey)) {
      const cached = audioCacheRef.current.get(cacheKey)!;
      downloadAudioBase64(cached.base64, `${section.title}-${selectedVoice}.wav`);
      return;
    }

    // Fetch and download
    try {
      const res = await requestTTS({
        text: section.scriptText,
        voice: selectedVoice,
        style: 'Warm, natural, engaging Indonesian voice narrator explaining tech economics',
      });
      const { audio, url, base64 } = createAudioFromBase64(res.audioBase64);
      audioCacheRef.current.set(cacheKey, { audio, url, base64 });
      downloadAudioBase64(res.audioBase64, `${section.title}-${selectedVoice}.wav`);
    } catch (err: any) {
      alert(`Gagal mengunduh audio: ${err.message || 'Kendala koneksi'}`);
    }
  };

  // Download from main audio player
  const handleDownloadCurrentAudio = async () => {
    const cacheKey = `${selectedVoice}_${currentPlayingId}`;
    if (audioCacheRef.current.has(cacheKey)) {
      const cached = audioCacheRef.current.get(cacheKey)!;
      downloadAudioBase64(cached.base64, `${currentTitle}-${selectedVoice}.wav`);
      return;
    }

    // Generate if not cached
    const textToGen =
      currentPlayingId === 'full'
        ? FULL_STORY_SCRIPT
        : STORY_SECTIONS.find((s) => s.id === currentPlayingId)?.scriptText || FULL_STORY_SCRIPT;

    setIsLoading(true);
    try {
      const res = await requestTTS({
        text: textToGen,
        voice: selectedVoice,
        style: 'Warm, natural, engaging Indonesian voice narrator explaining tech economics',
      });
      const { audio, url, base64 } = createAudioFromBase64(res.audioBase64);
      audioCacheRef.current.set(cacheKey, { audio, url, base64 });
      downloadAudioBase64(res.audioBase64, `${currentTitle}-${selectedVoice}.wav`);
    } catch (err: any) {
      alert(`Gagal mengunduh audio: ${err.message || 'Kendala koneksi'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle play/pause from the player bar
  const handleTogglePlay = () => {
    if (!currentAudioRef.current) {
      handlePlayFullStory();
      return;
    }

    if (currentAudioRef.current.paused) {
      currentAudioRef.current.play().catch(console.error);
    } else {
      currentAudioRef.current.pause();
    }
  };

  // Replay
  const handleReplay = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.play().catch(console.error);
    }
  };

  // Seek
  const handleSeek = (seconds: number) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  // Speed change
  const handleChangeSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (currentAudioRef.current) {
      currentAudioRef.current.playbackRate = speed;
    }
  };

  // Voice change
  const handleVoiceChange = (voice: string) => {
    setSelectedVoice(voice);
    if (currentAudioRef.current && isPlaying) {
      currentAudioRef.current.pause();
      setTimeout(() => {
        if (currentPlayingId === 'full') {
          playAudioForText(FULL_STORY_SCRIPT, 'full', currentTitle);
        } else {
          const sec = STORY_SECTIONS.find((s) => s.id === currentPlayingId);
          if (sec) {
            playAudioForText(sec.scriptText, sec.id, sec.title);
          }
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        selectedVoice={selectedVoice}
        onVoiceChange={handleVoiceChange}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        isPlayingGlobal={isPlaying}
        onOpenDeployGuide={() => setIsDeployModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
        {/* Error Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs font-bold underline ml-2"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-2xl border border-indigo-800/40">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            {/* Tag / Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
                <Headphones className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI TTS: gemini-3.8-flash-tts + Fitur Download WAV</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ✓ Siap Hosting Vercel
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight">
              Kalau aplikasinya gratis,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                dia dapat uang dari mana?
              </span>{' '}
              Kok bisa tetap untung?
            </h2>

            {/* Intro Copy */}
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Kamu pasti pernah mikir gitu. Dan jawabannya ternyata bukan satu, tapi ada{' '}
              <strong className="text-white font-bold">tiga petunjuk rahasia</strong>. Dengarkan narasinya, buat suara baru sendiri, dan download rekaman suaranya kapan saja.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlayFullStory}
                disabled={isLoading}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading && currentPlayingId === 'full' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sedang Menyiapkan Suara...</span>
                  </>
                ) : isPlaying && currentPlayingId === 'full' ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" />
                    <span>Jeda Narasi Penuh</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>Dengarkan Cerita Penuh (TTS)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setActiveTab('tts-studio')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition hover:scale-[1.02]"
              >
                <Mic className="w-4 h-4 text-amber-300" />
                <span>Bikin Suara Sendiri (TTS Studio)</span>
              </button>

              <button
                onClick={handleDownloadCurrentAudio}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/10 transition backdrop-blur-xs"
                title="Unduh rekaman suara audio WAV"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Audio</span>
              </button>
            </div>

            {/* 3 Quick Pillar Badges */}
            <div className="mt-8 pt-6 border-t border-indigo-800/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Petunjuk 1: <strong>Pengiklan yang Bayar</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Petunjuk 2: <strong>Fitur Premium / Freemium</strong></span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Petunjuk 3: <strong>Belanja & Kemitraan</strong></span>
              </div>
            </div>
          </div>
        </section>

        {/* Global Persistent Audio Player Bar */}
        <section className="sticky top-20 z-30">
          <AudioPlayerBar
            isPlaying={isPlaying}
            isLoading={isLoading}
            currentTime={currentTime}
            duration={duration}
            playbackRate={playbackRate}
            currentTitle={currentTitle}
            selectedVoice={selectedVoice}
            hasAudio={Boolean(currentAudioRef.current)}
            onTogglePlay={handleTogglePlay}
            onReplay={handleReplay}
            onSeek={handleSeek}
            onChangeSpeed={handleChangeSpeed}
            onVoiceChange={handleVoiceChange}
            onDownload={handleDownloadCurrentAudio}
          />
        </section>

        {/* Tab Content Display */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            {/* Story Sections List */}
            {STORY_SECTIONS.map((section, idx) => (
              <StorySectionCard
                key={section.id}
                section={section}
                isCurrentlyPlaying={isPlaying && currentPlayingId === section.id}
                isLoadingThisSection={isLoading && currentPlayingId === section.id}
                onPlaySection={handlePlaySection}
                onDownloadSection={handleDownloadSection}
                index={idx}
              />
            ))}

            {/* Summary Action Banner */}
            <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 border border-indigo-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Ingin coba ubah teks kamu sendiri menjadi suara AI?
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  Gunakan fitur Studio TTS untuk mengetik kalimat apapun dan mengunduh rekaman audionya dalam format WAV.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('tts-studio')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition whitespace-nowrap"
              >
                <span>Buka Studio Bikin Suara</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Comment Board */}
            <div className="pt-4">
              <MysteryCommentBoard selectedVoice={selectedVoice} />
            </div>
          </div>
        )}

        {activeTab === 'tts-studio' && (
          <div className="space-y-6">
            <TtsStudio />
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <MonetizationSimulator />
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 flex items-center justify-between">
              <span>Ingin mempelajari kembali ketiga petunjuk teori dasarnya?</span>
              <button
                onClick={() => setActiveTab('story')}
                className="font-bold underline text-indigo-700 ml-2"
              >
                Kembali ke 3 Petunjuk
              </button>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <PrivacyAuditSection />
          </div>
        )}

        {activeTab === 'comment' && (
          <div className="space-y-6">
            <MysteryCommentBoard selectedVoice={selectedVoice} />
          </div>
        )}
      </main>

      {/* Vercel Deploy Guide Modal */}
      <VercelDeployGuideModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]">
              $
            </div>
            <span className="font-semibold text-slate-800">
              Rahasia Monetisasi Aplikasi Gratis
            </span>
            <span className="text-slate-400">• Edukasi Ekonomi Digital</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 text-xs flex-wrap">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold underline flex items-center gap-1"
            >
              <span>Panduan Hosting Vercel (GitHub)</span>
            </button>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              TTS: <code className="text-slate-700 font-bold">gemini-3.8-flash-tts</code>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
