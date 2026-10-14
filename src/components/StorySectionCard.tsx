import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Pause,
  Loader2,
  TrendingUp,
  Cpu,
  ShieldAlert,
  Unlock,
  Zap,
  Repeat,
  ShoppingBag,
  Percent,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  Layers,
  CheckCircle,
  Lock,
  MessageSquare,
  Sparkles,
  Sliders,
  Download,
} from 'lucide-react';
import { StorySection } from '../data/storyData';

interface StorySectionCardProps {
  section: StorySection;
  isCurrentlyPlaying: boolean;
  isLoadingThisSection: boolean;
  onPlaySection: (section: StorySection) => void;
  onDownloadSection?: (section: StorySection) => void;
  index: number;
}

export const StorySectionCard: React.FC<StorySectionCardProps> = ({
  section,
  isCurrentlyPlaying,
  isLoadingThisSection,
  onPlaySection,
  onDownloadSection,
  index,
}) => {
  // Micro-interactive states
  const [dailyHours, setDailyHours] = useState(2.5);
  const [adFrequency, setAdFrequency] = useState(6);
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium'>('free');
  const [gameSkinCount, setGameSkinCount] = useState(2);

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-4 h-4 text-indigo-600' };
    switch (iconName) {
      case 'HelpCircle':
        return <HelpCircle {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      case 'Layers':
        return <Layers {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      case 'Cpu':
        return <Cpu {...props} />;
      case 'ShieldAlert':
        return <ShieldAlert {...props} className="w-4 h-4 text-amber-600" />;
      case 'Unlock':
        return <Unlock {...props} />;
      case 'Zap':
        return <Zap {...props} className="w-4 h-4 text-amber-500" />;
      case 'Repeat':
        return <Repeat {...props} />;
      case 'ShoppingBag':
        return <ShoppingBag {...props} />;
      case 'Percent':
        return <Percent {...props} />;
      case 'Link':
        return <LinkIcon {...props} />;
      case 'CheckCircle':
        return <CheckCircle {...props} className="w-4 h-4 text-emerald-600" />;
      case 'Lock':
        return <Lock {...props} className="w-4 h-4 text-rose-600" />;
      case 'MessageSquare':
        return <MessageSquare {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  const monthlyAdsSeen = Math.round(dailyHours * adFrequency * 30);
  const monthlyAdValue = Math.round((monthlyAdsSeen / 1000) * 35000);

  return (
    <article
      id={section.id}
      className={`relative bg-white rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden ${
        isCurrentlyPlaying
          ? 'ring-2 ring-indigo-500 border-indigo-300 shadow-indigo-100'
          : 'border-slate-200'
      }`}
    >
      {/* Active Audio Highlight Bar */}
      {isCurrentlyPlaying && (
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400" />
      )}

      <div className="p-5 sm:p-7">
        {/* Header Badge & Audio Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white bg-gradient-to-r ${section.badgeColor} shadow-xs`}
            >
              {section.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              #0{index + 1}
            </span>
          </div>

          {/* Action buttons: Play & Download */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPlaySection(section)}
              disabled={isLoadingThisSection}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isCurrentlyPlaying
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
              }`}
            >
              {isLoadingThisSection ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Membuat Suara...</span>
                </>
              ) : isCurrentlyPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Jeda Bagian Ini</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Dengarkan Suara</span>
                </>
              )}
            </button>

            {onDownloadSection && (
              <button
                onClick={() => onDownloadSection(section)}
                title="Download audio WAV untuk bagian ini"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WAV</span>
              </button>
            )}
          </div>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {section.title}
        </h3>
        <p className="text-sm text-slate-600 mt-1 mb-5">
          {section.subtitle}
        </p>

        {/* Narrative Script Box */}
        <div className="relative p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 my-4">
          <div className="absolute top-2 left-3 text-3xl font-serif text-indigo-200 select-none">
            “
          </div>
          <p className="text-sm sm:text-base leading-relaxed pl-5 font-medium text-slate-800 italic">
            {section.scriptText}
          </p>
          <div className="mt-2 text-right">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              — Narasi Asli
            </span>
          </div>
        </div>

        {/* Deep Explanation */}
        <p className="text-sm text-slate-600 leading-relaxed my-4">
          {section.extendedText}
        </p>

        {/* Key Insights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
          {section.keyInsights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-white hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded-md bg-white border border-slate-200 shadow-2xs">
                  {renderIcon(insight.icon)}
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  {insight.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {insight.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Micro-Widget for this specific clue */}
        {section.id === 'clue-1' && (
          <div className="mt-5 p-4 rounded-xl bg-blue-50/80 border border-blue-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-700" />
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                  Simulasi: Berapa Nilai Waktumu Bagi Pengiklan?
                </h4>
              </div>
              <span className="text-[11px] text-blue-700 bg-blue-100/80 font-semibold px-2 py-0.5 rounded">
                Model CPM
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                  <span>Waktu pakai aplikasi per hari:</span>
                  <strong className="text-blue-700 font-bold">{dailyHours} Jam</strong>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-blue-200 rounded-lg"
                />

                <label className="flex justify-between text-xs text-slate-700 font-medium mt-3 mb-1">
                  <span>Frekuensi iklan / konten sponsor:</span>
                  <strong className="text-blue-700 font-bold">{adFrequency} Iklan/Jam</strong>
                </label>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={adFrequency}
                  onChange={(e) => setAdFrequency(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-600 cursor-pointer h-2 bg-blue-200 rounded-lg"
                />
              </div>

              <div className="bg-white p-3.5 rounded-lg border border-blue-200 flex flex-col justify-center">
                <span className="text-[11px] text-slate-500 font-medium">
                  Estimasi iklan yang kamu tonton per bulan:
                </span>
                <span className="text-lg font-bold text-slate-900 font-mono">
                  ~{monthlyAdsSeen.toLocaleString('id-ID')} tayangan
                </span>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-600 font-semibold">
                    Setoran Pengiklan ke Aplikasi:
                  </span>
                  <span className="text-base font-extrabold text-blue-600 font-mono">
                    Rp{monthlyAdValue.toLocaleString('id-ID')} / bln
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 italic">
                  *Kamu tidak membayar uang, tapi atensi dan data preferensimu yang menghasilkan dana ini.
                </p>
              </div>
            </div>
          </div>
        )}

        {section.id === 'clue-2' && (
          <div className="mt-5 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-700" />
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  Perbandingan: Kenapa Freemium Sangat Berhasil?
                </h4>
              </div>
              <div className="flex bg-emerald-200/60 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setSelectedPlan('free')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    selectedPlan === 'free'
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-emerald-800'
                  }`}
                >
                  Versi Gratis (95% User)
                </button>
                <button
                  onClick={() => setSelectedPlan('premium')}
                  className={`px-2.5 py-1 rounded-md transition ${
                    selectedPlan === 'premium'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-emerald-800'
                  }`}
                >
                  Versi Premium (5% User)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>Status Pengalaman</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {selectedPlan === 'free' ? 'Rp 0 (Selamanya)' : 'Rp 49.000 / Bulan'}
                  </span>
                </div>
                <ul className="space-y-1.5 text-slate-600 mt-2">
                  <li className="flex items-center gap-1.5">
                    {selectedPlan === 'free' ? '⚠️ Diselingi iklan audio/video' : '✨ 100% Bebas Iklan'}
                  </li>
                  <li className="flex items-center gap-1.5">
                    {selectedPlan === 'free' ? '⚠️ Penyimpanan standar 15 GB' : '✨ Penyimpanan Cloud 100 GB - 2 TB'}
                  </li>
                  <li className="flex items-center gap-1.5">
                    {selectedPlan === 'free' ? '⚠️ Kualitas audio/video standar' : '✨ Resolusi Ultra HD / Lossless Audio'}
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-white rounded-lg border border-emerald-200 text-xs flex flex-col justify-center">
                <span className="font-bold text-slate-900">Efek Ekonomi Subsidi Silang:</span>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  Pengguna gratis membantu aplikasi menjadi viral dan terkenal. Namun 5% pelanggan setia
                  membayar langganan bulanan yang menanggung 100% beban server dan menghasilkan keuntungan bersih.
                </p>
              </div>
            </div>
          </div>
        )}

        {section.id === 'clue-3' && (
          <div className="mt-5 p-4 rounded-xl bg-purple-50/80 border border-purple-200/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-700" />
                <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                  Simulasi Microtransaction: Mengapa Game Gratis Paling Cuan?
                </h4>
              </div>
              <span className="text-[11px] text-purple-700 bg-purple-100 font-semibold px-2 py-0.5 rounded">
                In-App Purchases & Kemitraan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-slate-500 font-medium">Beli Skin Hero Game:</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-800 font-semibold">Beli {gameSkinCount} skin/bln</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setGameSkinCount(Math.max(1, gameSkinCount - 1))}
                      className="w-5 h-5 bg-slate-100 rounded text-center leading-none font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setGameSkinCount(gameSkinCount + 1)}
                      className="w-5 h-5 bg-slate-100 rounded text-center leading-none font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="text-purple-700 font-bold block mt-1">
                  Rp{(gameSkinCount * 75000).toLocaleString('id-ID')} / bulan
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Biaya produksi salinan skin digital: Rp 0!</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-slate-500 font-medium">Komisi Mitra (Take Rate):</span>
                <div className="text-slate-800 font-semibold mt-1">15% - 30% per transaksi</div>
                <span className="text-purple-700 font-bold block mt-1">Gojek, Grab, Play Store</span>
                <p className="text-[10px] text-slate-400 mt-1">Dipotong dari omset restoran atau merchant mitra.</p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-purple-200">
                <span className="text-slate-500 font-medium">Afiliasi & Referral:</span>
                <div className="text-slate-800 font-semibold mt-1">Bagi hasil klik link</div>
                <span className="text-purple-700 font-bold block mt-1">Komisi 2% - 10%</span>
                <p className="text-[10px] text-slate-400 mt-1">Setiap kali pengguna belanja lewat link di aplikasi.</p>
              </div>
            </div>
          </div>
        )}

        {/* Real World Examples Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Contoh Nyata di Sekitar Kita:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {section.examples.map((ex, i) => (
              <div
                key={i}
                className="flex flex-col bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{ex.name}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {ex.type}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 mt-1">{ex.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
