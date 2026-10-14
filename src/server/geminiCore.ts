import { GoogleGenAI } from '@google/genai';

// In-memory cache for generated TTS audio to ensure instant replay
const audioCache = new Map<string, string>();

export function getGeminiClient() {
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

export async function generateTTSAudio(text: string, voice = 'Kore', style = 'Warm, expressive, natural Indonesian storyteller explaining digital technology clearly') {
  const trimmedText = text.trim();
  const cacheKey = `${voice}_${style}_${trimmedText}`;

  if (audioCache.has(cacheKey)) {
    return {
      audioBase64: audioCache.get(cacheKey)!,
      mimeType: 'audio/wav',
      cached: true,
    };
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
    throw new Error('Model failed to return audio data');
  }

  // Cache the audio
  audioCache.set(cacheKey, base64Audio);

  return {
    audioBase64: base64Audio,
    mimeType: 'audio/wav',
    cached: false,
  };
}

export async function answerMysteryQuestion(question: string, voice = 'Kore') {
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
    const ttsResult = await generateTTSAudio(
      answer,
      voice,
      'Engaging, friendly, knowledgeable Indonesian speaker responding conversationally'
    );
    audioBase64 = ttsResult.audioBase64;
  } catch (ttsErr) {
    console.warn('TTS generation for comment answer had issue:', ttsErr);
  }

  return {
    answer,
    audioBase64,
    mimeType: audioBase64 ? 'audio/wav' : null,
  };
}
