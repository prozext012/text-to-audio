import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory cache for generated TTS audio to ensure instant replay
const audioCache = new Map<string, string>();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Full narrative script matching user text exactly
export const FULL_SCRIPT_ID = `Kalau aplikasinya gratis, dia dapat uang dari mana? Kok bisa tetap untung?

Kamu pasti pernah mikir gitu. Dan jawabannya ternyata bukan satu, tapi ada tiga petunjuk. Kita buka satu per satu.

Petunjuk pertama: pengiklan yang bayar. Bukan kamu yang bayar, tapi iklan yang kamu lihat di dalam aplikasi itu dibayar oleh pengiklan. Makin sering kamu pakai, makin sering iklan itu tampil. Bahkan kebiasaanmu di aplikasi bisa dipakai supaya iklannya terasa lebih pas buat kamu.

Petunjuk kedua: fitur premium. Fitur dasarnya gratis, tapi yang lebih lengkap harus bayar. Misalnya tanpa iklan, penyimpanan yang lebih besar, atau akses eksklusif. Nggak semua orang upgrade, tapi yang upgrade itu yang bikin aplikasinya tetap hidup.

Petunjuk ketiga: belanja di dalam aplikasi dan kemitraan. Ada yang jual item game atau fitur tambahan, ada juga yang kerja sama dengan pihak lain, seperti afiliasi.

Jadi jawabannya: gratis buat kamu, tapi ada yang bayar. Pengiklan, pengguna premium, dan mitra.

Biar tenang, cek izin aplikasi dan kebijakan privasinya sebelum kamu pasang.

Penasaran misteri lain? Tulis di komentar!`;

// Endpoint: POST /api/tts
// Uses model: gemini-3.8-flash-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore', style = 'Warm, expressive, natural Indonesian storyteller explaining digital technology clearly' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS generation' });
    }

    const trimmedText = text.trim();
    const cacheKey = `${voice}_${style}_${trimmedText}`;

    if (audioCache.has(cacheKey)) {
      return res.json({
        audioBase64: audioCache.get(cacheKey),
        mimeType: 'audio/wav',
        cached: true,
      });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: trimmedText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'Model failed to return audio data' });
    }

    // Cache the result
    audioCache.set(cacheKey, base64Audio);

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      cached: false,
    });
  } catch (error: any) {
    console.error('Error generating TTS with gemini-3.8-flash-tts:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate speech audio',
    });
  }
});

// Endpoint: POST /api/ask-mystery
// Answers questions about tech monetization and creates TTS commentary
app.post('/api/ask-mystery', async (req: Request, res: Response) => {
  try {
    const { question, voice = 'Kore' } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const ai = getGeminiClient();

    // 1. Generate insightful explanation with gemini-3.8-flash
    const textResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question,
      config: {
        systemInstruction: `Anda adalah pakar ekonomi teknologi digital dan privasi aplikasi yang ramah dan edukatif.
Jawab pertanyaan pengguna mengenai cara kerja aplikasi gratis, monetisasi teknologi, privasi data, atau model bisnis internet.
Gunakan Bahasa Indonesia yang kasual, akrab, jelas, mudah dipahami (gaya santai seperti konten edukasi video pendek), dan maksimal 3-4 paragraf pendek yang to-the-point.
Sertakan tips cerdas bagi pengguna di akhir jawaban.`,
      },
    });

    const answer = textResponse.text || 'Maaf, belum bisa menjawab saat ini.';

    // 2. Generate voice narration for this answer using gemini-3.8-flash-tts
    let audioBase64: string | null = null;
    try {
      const ttsResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: answer,
                speechMetadata: {
                  style: 'Engaging, friendly, knowledgeable Indonesian speaker responding conversationally',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      audioBase64 = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (ttsErr) {
      console.warn('TTS generation for comment answer had issue:', ttsErr);
    }

    return res.json({
      answer,
      audioBase64,
      mimeType: audioBase64 ? 'audio/wav' : null,
    });
  } catch (error: any) {
    console.error('Error handling mystery question:', error);
    return res.status(500).json({
      error: error.message || 'Failed to answer question',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer();
