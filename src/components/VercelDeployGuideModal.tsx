import React from 'react';
import { X, ExternalLink, Check, Copy, Sparkles, Github, Terminal } from 'lucide-react';

interface VercelDeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployGuideModal: React.FC<VercelDeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M24 22.525H0l12-21.05 12 21.05z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Panduan Hosting di Vercel (via GitHub)</h3>
              <p className="text-xs text-slate-300">Konfigurasi vercel.json & Serverless API siap deploy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-950">Aplikasi sudah 100% siap untuk Vercel!</strong>
              File <code className="bg-emerald-100 px-1 py-0.5 rounded text-xs">vercel.json</code> dan Serverless Functions di <code className="bg-emerald-100 px-1 py-0.5 rounded text-xs">/api/tts.ts</code> sudah dikonfigurasi secara otomatis.
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1 space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <Github className="w-4 h-4 text-slate-800" />
                  Push Kode ke GitHub Repository Anda
                </h4>
                <p className="text-slate-600 text-xs">
                  Buka terminal di komputer Anda, inisialisasi git jika belum, lalu push ke GitHub:
                </p>
                <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'git add .\ngit commit -m "feat: text-to-audio with download & vercel config"\ngit push origin main',
                        'git'
                      )
                    }
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <code>
                    git add .<br />
                    git commit -m "feat: text-to-audio with download & vercel config"<br />
                    git push origin main
                  </code>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-slate-900">Import Repository di Vercel Dashboard</h4>
                <p className="text-slate-600 text-xs">
                  Buka <strong>vercel.com</strong>, klik <strong>"Add New..." &gt; "Project"</strong>, lalu pilih repository GitHub Anda.
                </p>
                <p className="text-slate-500 text-xs italic">
                  *Vercel akan otomatis mengenali project sebagai Vite dengan build command <code>npm run build</code> dan output directory <code>dist</code>.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-slate-900">Tambahkan Environment Variable di Vercel</h4>
                <p className="text-slate-600 text-xs">
                  Pada bagian <strong>Environment Variables</strong> di Vercel sebelum menekan tombol Deploy, tambahkan:
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-bold text-indigo-700">GEMINI_API_KEY</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard('GEMINI_API_KEY', 'envkey')}
                      className="text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {copiedKey === 'envkey' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin Nama</span>
                    </button>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Isi nilainya dengan Gemini API key Anda yang aktif (dari Google AI Studio).
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-slate-900">Klik "Deploy"</h4>
                <p className="text-slate-600 text-xs">
                  Dalam waktu sekitar 1 menit, website Anda sudah aktif di domain gratis Vercel (seperti <code>https://nama-repo.vercel.app</code>) dengan audio TTS dan download berfungsi 100%!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-indigo-700 font-semibold hover:underline"
          >
            <span>Buka Dashboard Vercel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
