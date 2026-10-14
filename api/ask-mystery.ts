import type { Request, Response } from 'express';
import { answerMysteryQuestion } from '../src/server/geminiCore';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { question, voice = 'Kore' } = req.body || {};

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const result = await answerMysteryQuestion(question, voice);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API error in /api/ask-mystery:', error);
    return res.status(500).json({
      error: error.message || 'Failed to answer question',
    });
  }
}
