import React, { useState } from 'react';
import { DollarSign, Users, Eye, Sparkles, TrendingUp, ShieldCheck, PieChart } from 'lucide-react';

export const MonetizationSimulator: React.FC = () => {
  const [appType, setAppType] = useState<'social' | 'game' | 'utility' | 'streaming'>('social');
  const [userCount, setUserCount] = useState<number>(500000); // 500k MAU
  const [adsPerDay, setAdsPerDay] = useState<number>(6);
  const [cpmRate, setCpmRate] = useState<number>(30000); // Rp30.000 / 1000 views
  const [premiumPercent, setPremiumPercent] = useState<number>(3); // 3%
  const [subPrice, setSubPrice] = useState<number>(45000); // Rp45.000 / bln
  const [iapBuyersPercent, setIapBuyersPercent] = useState<number>(2); // 2%
  const [averageIapSpend, setAverageIapSpend] = useState<number>(50000); // Rp50.000

  // Presets based on app category
  const setPreset = (type: 'social' | 'game' | 'utility' | 'streaming') => {
    setAppType(type);
    if (type === 'social') {
      setAdsPerDay(8);
      setCpmRate(35000);
      setPremiumPercent(1.5);
      setSubPrice(39000);
      setIapBuyersPercent(1);
      setAverageIapSpend(30000);
    } else if (type === 'game') {
      setAdsPerDay(12);
      setCpmRate(45000);
      setPremiumPercent(1);
      setSubPrice(29000);
      setIapBuyersPercent(6);
      setAverageIapSpend(85000);
    } else if (type === 'utility') {
      setAdsPerDay(2);
      setCpmRate(20000);
      setPremiumPercent(5);
      setSubPrice(55000);
      setIapBuyersPercent(0.5);
      setAverageIapSpend(25000);
    } else if (type === 'streaming') {
      setAdsPerDay(4);
      setCpmRate(40000);
      setPremiumPercent(7);
      setSubPrice(49000);
      setIapBuyersPercent(1);
      setAverageIapSpend(20000);
    }
  };

  // Calculations
  // 1. Ad Revenue per month: Users * AdsPerDay * 30 * (CPM / 1000)
  const monthlyAdImpressions = userCount * adsPerDay * 30;
  const monthlyAdRevenue = Math.round((monthlyAdImpressions / 1000) * cpmRate);

  // 2. Premium Subscription Revenue per month: Users * (premiumPercent/100) * subPrice
  const premiumUsers = Math.round(userCount * (premiumPercent / 100));
  const monthlySubRevenue = Math.round(premiumUsers * subPrice);

  // 3. IAP / Shop Revenue per month: Users * (iapBuyersPercent/100) * averageIapSpend
  const iapUsers = Math.round(userCount * (iapBuyersPercent / 100));
  const monthlyIapRevenue = Math.round(iapUsers * averageIapSpend);

  // Total
  const totalMonthlyRevenue = monthlyAdRevenue + monthlySubRevenue + monthlyIapRevenue;
  const annualRevenue = totalMonthlyRevenue * 12;

  // Percentages for visual breakdown
  const adShare = totalMonthlyRevenue > 0 ? (monthlyAdRevenue / totalMonthlyRevenue) * 100 : 0;
  const subShare = totalMonthlyRevenue > 0 ? (monthlySubRevenue / totalMonthlyRevenue) * 100 : 0;
  const iapShare = totalMonthlyRevenue > 0 ? (monthlyIapRevenue / totalMonthlyRevenue) * 100 : 0;

  const formatIDR = (val: number) => {
    if (val >= 1000000000) {
      return `Rp ${(val / 1000000000).toFixed(2)} Miliar`;
    }
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(1)} Juta`;
    }
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            Simulator Interaktif
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Bagaimana Aplikasi Gratis Menjadi Bisnis Miliaran?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Ubah variabel pengguna dan strategi monetisasi untuk melihat proyeksi omset bulanan secara nyata.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setPreset('social')}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              appType === 'social' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Media Sosial
          </button>
          <button
            onClick={() => setPreset('game')}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              appType === 'game' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Game Mobile
          </button>
          <button
            onClick={() => setPreset('utility')}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              appType === 'utility' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Tools / Catatan
          </button>
          <button
            onClick={() => setPreset('streaming')}
            className={`px-2.5 py-1.5 rounded-lg transition ${
              appType === 'streaming' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'
            }`}
          >
            Streaming Musik
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          {/* User count slider */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Jumlah Pengguna Aktif Bulanan (MAU)
              </span>
              <span className="text-sm font-extrabold text-indigo-600 font-mono">
                {userCount.toLocaleString('id-ID')} Orang
              </span>
            </div>
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={userCount}
              onChange={(e) => setUserCount(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>50 Ribu</span>
              <span>1 Juta</span>
              <span>5 Juta Pengguna</span>
            </div>
          </div>

          {/* 3 Pillars Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Iklan */}
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                1. Iklan (Ads)
              </div>

              <label className="text-[11px] text-slate-600 block mb-1">
                Iklan/Hari: <strong>{adsPerDay}</strong>
              </label>
              <input
                type="range"
                min="1"
                max="15"
                value={adsPerDay}
                onChange={(e) => setAdsPerDay(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-blue-200 rounded"
              />

              <label className="text-[11px] text-slate-600 block mt-2 mb-1">
                Tarif CPM: <strong>Rp{cpmRate.toLocaleString('id-ID')}</strong>
              </label>
              <input
                type="range"
                min="10000"
                max="80000"
                step="5000"
                value={cpmRate}
                onChange={(e) => setCpmRate(parseInt(e.target.value, 10))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-blue-200 rounded"
              />
            </div>

            {/* 2. Premium */}
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                2. Premium Sub
              </div>

              <label className="text-[11px] text-slate-600 block mb-1">
                Konversi: <strong>{premiumPercent}%</strong>
              </label>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={premiumPercent}
                onChange={(e) => setPremiumPercent(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-emerald-200 rounded"
              />

              <label className="text-[11px] text-slate-600 block mt-2 mb-1">
                Harga: <strong>Rp{subPrice.toLocaleString('id-ID')}</strong>
              </label>
              <input
                type="range"
                min="15000"
                max="120000"
                step="5000"
                value={subPrice}
                onChange={(e) => setSubPrice(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-emerald-200 rounded"
              />
            </div>

            {/* 3. Belanja / IAP */}
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="text-xs font-bold text-purple-900 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                3. Belanja & Mitra
              </div>

              <label className="text-[11px] text-slate-600 block mb-1">
                Pembeli Item: <strong>{iapBuyersPercent}%</strong>
              </label>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={iapBuyersPercent}
                onChange={(e) => setIapBuyersPercent(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-purple-200 rounded"
              />

              <label className="text-[11px] text-slate-600 block mt-2 mb-1">
                Rata-rata: <strong>Rp{averageIapSpend.toLocaleString('id-ID')}</strong>
              </label>
              <input
                type="range"
                min="10000"
                max="150000"
                step="10000"
                value={averageIapSpend}
                onChange={(e) => setAverageIapSpend(parseInt(e.target.value, 10))}
                className="w-full accent-purple-600 cursor-pointer h-1.5 bg-purple-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                Total Estimasi Omset
              </span>
              <span className="text-[11px] text-slate-400 font-mono">Per Bulan</span>
            </div>

            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2 font-mono tracking-tight">
              {formatIDR(totalMonthlyRevenue)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-mono">
              (~{formatIDR(annualRevenue)} / tahun)
            </div>

            {/* Visual Proportion Bar */}
            <div className="mt-5">
              <div className="text-[11px] text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                <span>Distribusi Pendapatan:</span>
                <PieChart className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${adShare}%` }}
                  className="bg-blue-500 h-full transition-all duration-300"
                  title={`Iklan: ${adShare.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${subShare}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title={`Premium: ${subShare.toFixed(1)}%`}
                />
                <div
                  style={{ width: `${iapShare}%` }}
                  className="bg-purple-500 h-full transition-all duration-300"
                  title={`Belanja & Mitra: ${iapShare.toFixed(1)}%`}
                />
              </div>
            </div>

            {/* Breakdown Item List */}
            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Pengiklan yang Bayar:
                </span>
                <span className="font-bold text-white">
                  {formatIDR(monthlyAdRevenue)} ({adShare.toFixed(0)}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Langganan Premium:
                </span>
                <span className="font-bold text-white">
                  {formatIDR(monthlySubRevenue)} ({subShare.toFixed(0)}%)
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <span className="flex items-center gap-1.5 text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Item Digital & Mitra:
                </span>
                <span className="font-bold text-white">
                  {formatIDR(monthlyIapRevenue)} ({iapShare.toFixed(0)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Meskipun 95% pengguna menikmati gratis, 3 pilar ini mampu menutup biaya server dan menghasilkan profit fantastis.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
