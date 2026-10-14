import type { Request, Response } from 'express';
import { answerMysteryQuestion } from '../src/server/geminiCore';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { question, voice = 'Kore' } = body;

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
