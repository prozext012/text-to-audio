import type { Request, Response } from 'express';
import { generateTTSAudio } from '../src/server/geminiCore';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { text, voice = 'Kore', style = 'Warm, expressive, natural Indonesian storyteller explaining digital technology clearly' } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS generation' });
    }

    const result = await generateTTSAudio(text, voice, style);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API error in /api/tts:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate speech audio',
    });
  }
}
