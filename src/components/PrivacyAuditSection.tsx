import React, { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, Check, AlertTriangle, Eye, Lock, Smartphone, HelpCircle } from 'lucide-react';
import { PRIVACY_CHECKLIST } from '../data/storyData';

const SAMPLE_APPS_AUDIT = [
  {
    id: 'calculator',
    name: 'Kalkulator Cepat & Senter LED',
    category: 'Alat Sederhana',
    icon: '🧮',
    requestedPermissions: [
      { name: 'Kamera & Flashlight', status: 'normal', reason: 'Menyalakan LED senter' },
      { name: 'Buku Kontak', status: 'danger', reason: 'TIDAK WAJAR! Kalkulator tidak butuh daftar kontak Anda' },
      { name: 'Akses Mikrofon', status: 'danger', reason: 'TIDAK WAJAR! Mengapa butuh merekam suara?' },
      { name: 'Lokasi Akurat (GPS)', status: 'danger', reason: 'TIDAK WAJAR! Berpotensi menjual data rute Anda' },
    ],
    verdict: 'BAHAYA (Red Flag)',
    score: 25,
    recommendation: 'Jangan install! Aplikasi utilitas sederhana yang meminta kontak dan mic kemungkinan besar adalah spyware / adware pemburu data.',
  },
  {
    id: 'ride_hailing',
    name: 'Aplikasi Transportasi & Ojek',
    category: 'Perjalanan & Antar Makanan',
    icon: '🛵',
    requestedPermissions: [
      { name: 'Lokasi Presisi (GPS)', status: 'normal', reason: 'Wajar: Menentukan titik jemput dan rute driver' },
      { name: 'Kamera', status: 'normal', reason: 'Wajar: Mengambil foto bukti penerimaan paket' },
      { name: 'Penyimpanan', status: 'normal', reason: 'Wajar: Cache peta offline' },
      { name: 'Buku Kontak', status: 'warning', reason: 'Opsional: Hanya untuk fitur kirim saldo / transfer ke teman' },
    ],
    verdict: 'AMAN & LOGIS',
    score: 92,
    recommendation: 'Aman untuk dipasang. Pastikan izin lokasi diatur ke "Hanya saat aplikasi digunakan" (While Using App).',
  },
  {
    id: 'social_app',
    name: 'Media Sosial & Video Pendek',
    category: 'Sosial & Hiburan',
    icon: '📱',
    requestedPermissions: [
      { name: 'Kamera & Mikrofon', status: 'normal', reason: 'Wajar: Merekam video & live streaming' },
      { name: 'Pelacakan Lintas Aplikasi (Ad ID)', status: 'warning', reason: 'Wajar untuk bisnis iklan, tapi bisa Anda tolak untuk privasi' },
      { name: 'Buku Kontak', status: 'warning', reason: 'Opsional: Sinkronisasi pertemanan' },
      { name: 'Penyimpanan Penuh', status: 'warning', reason: 'Sebaiknya batasi ke foto pilihan' },
    ],
    verdict: 'PERLU WASPADA PENGATURAN',
    score: 74,
    recommendation: 'Aplikasi resmi aman, namun matikan pelacakan iklan tertarget di pengaturan privasi HP Anda jika tidak ingin kebiasaan browsing diprofiling.',
  },
];

export const PrivacyAuditSection: React.FC = () => {
  const [selectedAuditApp, setSelectedAuditApp] = useState(SAMPLE_APPS_AUDIT[0]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    camera: true,
    location: true,
    contacts: false,
    storage: false,
    tracking: true,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-7">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 mb-2">
          <Shield className="w-3.5 h-3.5 text-rose-600" />
          Biar Tenang Sebelum Install
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Panduan Cek Izin Aplikasi & Kebijakan Privasi
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Aplikasi gratis tetap harus menghormati privasimu. Pelajari mana izin yang logis dan mana yang menjadi tanda bahaya.
        </p>
      </div>

      {/* Interactive Audit Simulator */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-indigo-600" />
            Simulasi Audit Izin: Pilih Contoh Aplikasi
          </h4>
          <span className="text-[11px] text-slate-500">Klik untuk melihat analisis</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          {SAMPLE_APPS_AUDIT.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedAuditApp(app)}
              className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                selectedAuditApp.id === app.id
                  ? 'bg-white border-indigo-500 ring-2 ring-indigo-200 shadow-xs'
                  : 'bg-white/60 border-slate-200 hover:bg-white text-slate-700'
              }`}
            >
              <span className="text-2xl">{app.icon}</span>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{app.name}</div>
                <div className="text-[10px] text-slate-500">{app.category}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Selected App Audit Result */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedAuditApp.icon}</span>
              <div>
                <h5 className="text-sm font-bold text-slate-900">{selectedAuditApp.name}</h5>
                <span className="text-[11px] text-slate-500">{selectedAuditApp.category}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedAuditApp.score < 50
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : selectedAuditApp.score < 80
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {selectedAuditApp.verdict} (Skor Keamanan: {selectedAuditApp.score}/100)
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Daftar Izin yang Diminta:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedAuditApp.requestedPermissions.map((perm, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                    perm.status === 'danger'
                      ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                      : perm.status === 'warning'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  {perm.status === 'danger' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  ) : perm.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold block">{perm.name}</span>
                    <span className="text-[11px] opacity-90">{perm.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong>Rekomendasi Cerdas:</strong> {selectedAuditApp.recommendation}
            </div>
          </div>
        </div>
      </div>

      {/* Permission Checklist Cards */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
          <Lock className="w-4 h-4 text-indigo-600" />
          5 Titik Kritis Izin HP yang Wajib Anda Periksa
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRIVACY_CHECKLIST.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                checkedItems[item.id]
                  ? 'bg-indigo-50/40 border-indigo-200 shadow-2xs'
                  : 'bg-slate-50/60 border-slate-200/80 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                      checkedItems[item.id]
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {checkedItems[item.id] && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <h5 className="text-xs font-bold text-slate-900">{item.title}</h5>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.risk === 'Tinggi'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  Risiko {item.risk}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pl-6 mb-1.5">
                <strong>Fungsi Wajar:</strong> {item.typicalReason}
              </p>
              <div className="text-[11px] text-slate-700 pl-6 bg-white/80 p-2 rounded border border-slate-200/60">
                <strong>💡 Tips:</strong> {item.tip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
