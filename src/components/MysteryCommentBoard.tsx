import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, Volume2, Play, Pause, Loader2, Bot, HelpCircle, User } from 'lucide-react';
import { PRESET_MYSTERIES } from '../data/storyData';
import { askMystery, createAudioFromBase64 } from '../services/ttsService';

interface CommentItem {
  id: string;
  author: string;
  question: string;
  answer: string;
  audioBase64?: string;
  timestamp: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'Rian Pratama',
    question: 'Dari mana WhatsApp dapat untung padahal aplikasinya gratis dan tanpa ada iklan banner?',
    answer:
      'Pertanyaan bagus! WhatsApp memang tidak pasang iklan di chat pribadimu demi menjaga kepercayaan. Tapi WhatsApp menghasilkan triliunan dari WhatsApp Business API. Perusahaan besar (seperti bank, maskapai penerbangan, dan e-commerce) membayar biaya per pesan untuk mengirim notifikasi OTP, tiket perjalanan, dan layanan customer service resmi. Selain itu, data WhatsApp terintegrasi dalam ekosistem Meta untuk mengukur efektivitas iklan Click-to-WhatsApp di Instagram!',
    timestamp: 'Baru saja',
  },
  {
    id: 'c2',
    author: 'Dina Safitri',
    question: 'Kenapa game gratis sering banget maksa kita nonton iklan video 30 detik untuk dapat nyawa atau koin?',
    answer:
      'Format iklan ini disebut "Rewarded Video Ad". Bagi pengembang game gratis, ini adalah tambang emas karena pengiklan membayar tarif CPM tertinggi ketika pengguna menonton video hingga tuntas. Pengguna rela menonton karena mendapat hadiah item gratis, pengiklan senang pesannya tersampaikan penuh, dan game maker dapat cuan tanpa memaksa kamu bayar uang!',
    timestamp: '15 menit lalu',
  },
];

interface MysteryCommentBoardProps {
  selectedVoice: string;
}

export const MysteryCommentBoard: React.FC<MysteryCommentBoardProps> = ({ selectedVoice }) => {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [inputQuestion, setInputQuestion] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Play comment audio
  const handlePlayCommentAudio = async (item: CommentItem) => {
    // If currently playing this comment, pause it
    if (currentlyPlayingId === item.id && currentAudio) {
      if (!currentAudio.paused) {
        currentAudio.pause();
        setCurrentlyPlayingId(null);
        return;
      }
    }

    if (currentAudio) {
      currentAudio.pause();
    }

    // If audio already exists, play it
    if (item.audioBase64) {
      const { audio } = createAudioFromBase64(item.audioBase64);
      audio.onended = () => setCurrentlyPlayingId(null);
      setCurrentAudio(audio);
      setCurrentlyPlayingId(item.id);
      audio.play().catch(console.error);
      return;
    }

    // Else request TTS on the fly
    try {
      setCurrentlyPlayingId(item.id);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.answer,
          voice: selectedVoice,
          style: 'Engaging, friendly Indonesian tech host answering user comment',
        }),
      });

      const data = await res.json();
      if (data.audioBase64) {
        item.audioBase64 = data.audioBase64;
        const { audio } = createAudioFromBase64(data.audioBase64);
        audio.onended = () => setCurrentlyPlayingId(null);
        setCurrentAudio(audio);
        audio.play().catch(console.error);
      } else {
        setCurrentlyPlayingId(null);
      }
    } catch (e) {
      console.error('Failed to stream audio for comment:', e);
      setCurrentlyPlayingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    setIsSubmitting(true);
    const q = inputQuestion.trim();
    const name = authorName.trim() || 'Penjelajah Penasaran';

    try {
      const response = await askMystery(q, selectedVoice);

      const newComment: CommentItem = {
        id: `c_${Date.now()}`,
        author: name,
        question: q,
        answer: response.answer,
        audioBase64: response.audioBase64,
        timestamp: 'Baru saja',
      };

      setComments((prev) => [newComment, ...prev]);
      setInputQuestion('');

      // Auto play newly generated answer
      if (response.audioBase64) {
        if (currentAudio) currentAudio.pause();
        const { audio } = createAudioFromBase64(response.audioBase64);
        audio.onended = () => setCurrentlyPlayingId(null);
        setCurrentAudio(audio);
        setCurrentlyPlayingId(newComment.id);
        audio.play().catch(console.error);
      }
    } catch (err: any) {
      alert(`Terjadi kesalahan: ${err.message || 'Gagal memproses pertanyaan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="tanya-misteri" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
          Penasaran Misteri Lain? Tulis di Komentar!
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Tanya Misteri Teknologi & Monetisasi Digital
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Tanyakan rasa penasaranmu tentang cara kerja aplikasi gratis, kuota internet, atau rahasia algoritma. AI kami akan menjawab dan membacakannya dengan suara narator TTS!
        </p>
      </div>

      {/* Preset Ideas */}
      <div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
          Inspirasi Misteri Populer:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_MYSTERIES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuestion(preset);
                setActivePreset(preset);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/80 transition-colors text-slate-700 text-left"
            >
              💬 {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kamu:</label>
            <input
              type="text"
              placeholder="Contoh: Budi, Sarah, Anonim"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Pertanyaan Misteri:</label>
            <input
              type="text"
              required
              placeholder="Ketik pertanyaanmu di sini..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            Akan dijawab dan dinarasikan otomatis via TTS
          </span>

          <button
            type="submit"
            disabled={isSubmitting || !inputQuestion.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Membuat Jawaban & Suara...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Kirim & Dengarkan Jawaban</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-indigo-600" />
          Diskusi & Jawaban Misteri ({comments.length})
        </h4>

        {comments.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border transition-all ${
              currentlyPlayingId === item.id
                ? 'bg-indigo-50/50 border-indigo-300 ring-2 ring-indigo-200'
                : 'bg-white border-slate-200/90'
            }`}
          >
            {/* User Question */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 text-xs font-bold border border-slate-200">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900">{item.author}</span>
                  <span className="text-[10px] text-slate-400 ml-2 font-mono">{item.timestamp}</span>
                </div>
              </div>

              {/* TTS play button */}
              <button
                onClick={() => handlePlayCommentAudio(item)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  currentlyPlayingId === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                }`}
              >
                {currentlyPlayingId === item.id ? (
                  <>
                    <Pause className="w-3 h-3 fill-current" />
                    <span>Jeda Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <Volume2 className="w-3 h-3 text-indigo-500" />
                    <span>Bacakan Jawaban</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-800 pl-9 mb-3">
              "{item.question}"
            </p>

            {/* AI Answer Box */}
            <div className="ml-9 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs leading-relaxed text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-indigo-700 mb-1">
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>Penjelasan Jawaban:</span>
              </div>
              <p className="whitespace-pre-line text-slate-700">{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
