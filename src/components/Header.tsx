import React from 'react';
import { Volume2, Sparkles, Shield, DollarSign, HelpCircle, Layers, Mic, Download, ExternalLink } from 'lucide-react';
import { VOICES } from '../data/storyData';

interface HeaderProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  isPlayingGlobal: boolean;
  onOpenDeployGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedVoice,
  onVoiceChange,
  activeTab,
  onTabChange,
  isPlayingGlobal,
  onOpenDeployGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo / Branding */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight">
                  Rahasia Aplikasi Gratis
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  TTS gemini-3.8-flash-tts
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate hidden sm:block">
                Kalau aplikasinya gratis, dia dapat untung dari mana?
              </p>
            </div>
          </div>

          {/* Voice Selector, Deploy & Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Deploy Vercel Button */}
            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-xs"
            >
              <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                <path d="M24 22.525H0l12-21.05 12 21.05z" />
              </svg>
              <span className="hidden sm:inline">Deploy Vercel</span>
              <span className="sm:hidden">Deploy</span>
            </button>

            {/* Voice Persona Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/80 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Volume2 className={`w-4 h-4 text-indigo-600 ${isPlayingGlobal ? 'animate-pulse' : ''}`} />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider leading-none">
                  Suara Narator
                </span>
                <select
                  value={selectedVoice}
                  onChange={(e) => onVoiceChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
                  aria-label="Pilih Suara Narator TTS"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gender} - {v.tone.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 -mb-px border-t border-slate-100 no-scrollbar text-xs font-medium">
          <button
            onClick={() => onTabChange('story')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'story'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            3 Petunjuk Utama
          </button>

          <button
            onClick={() => onTabChange('tts-studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'tts-studio'
                ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold shadow-xs'
                : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50/70 font-semibold'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Studio Bikin Suara Baru (TTS)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-extrabold uppercase">
              Baru
            </span>
          </button>

          <button
            onClick={() => onTabChange('simulator')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'simulator'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Simulator Omset
          </button>

          <button
            onClick={() => onTabChange('privacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'privacy'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Cek Izin Privasi
          </button>

          <button
            onClick={() => onTabChange('comment')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md whitespace-nowrap transition-all ${
              activeTab === 'comment'
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Tanya Misteri AI
          </button>
        </div>
      </div>
    </header>
  );
};
