import React from 'react';
import { X, ExternalLink, Check, Copy, Github, AlertCircle } from 'lucide-react';

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
              <h3 className="text-base sm:text-lg font-bold">Solusi Build & Hosting Vercel</h3>
              <p className="text-xs text-slate-300">Konfigurasi Web App (bukan APK) & Perbaikan ERESOLVE</p>
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
          {/* Resolution Banner */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-2.5">
            <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-950">Masalah ERESOLVE esbuild Sudah Diperbaiki!</strong>
              Penyebab error di Vercel adalah konflik versi paket <code className="bg-emerald-100 px-1 py-0.5 rounded text-xs font-mono">esbuild</code> dengan Vite 8. Kami telah menghapus dependensi yang bentrok, menambahkan <code className="bg-emerald-100 px-1 py-0.5 rounded text-xs font-mono">.npmrc</code>, dan mengatur <code className="bg-emerald-100 px-1 py-0.5 rounded text-xs font-mono">legacy-peer-deps</code> di vercel.json.
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-blue-950">100% Web App Responsive (Bukan APK)</strong>
              Aplikasi ini adalah website modern berbasis React & Vite yang bisa dibuka langsung di browser HP, tablet, maupun laptop tanpa perlu menginstall file APK sama sekali.
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
                  Kirim Perbaikan ke GitHub Repo Anda
                </h4>
                <p className="text-slate-600 text-xs">
                  Jalankan perintah ini di terminal folder project Anda agar perubahan masuk ke repo GitHub:
                </p>
                <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-xs overflow-x-auto">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        'git add .\ngit commit -m "fix: resolve esbuild peer dependency & add .npmrc for vercel"\ngit push origin main',
                        'git'
                      )
                    }
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                  >
                    {copiedKey === 'git' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <code>
                    git add .<br />
                    git commit -m "fix: resolve esbuild peer dependency & add .npmrc for vercel"<br />
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
              <div className="flex-1 space-y-2">
                <h4 className="font-bold text-slate-900">Pastikan Environment Variable Terisi di Vercel</h4>
                <p className="text-slate-600 text-xs">
                  Buka project Anda di <strong>Vercel Dashboard &gt; Settings &gt; Environment Variables</strong>:
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
                    Isi nilainya dengan API key Gemini Anda dari Google AI Studio.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-bold text-slate-900">Redeploy di Vercel</h4>
                <p className="text-slate-600 text-xs">
                  Begitu Anda push ke GitHub, Vercel akan otomatis mendeteksi commit baru dan menjalankan build. Anda juga bisa menekan tombol <strong>"Redeploy"</strong> di tab Deployments Vercel. Error ERESOLVE tidak akan muncul lagi!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <a
            href="https://vercel.com/dashboard"
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
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
