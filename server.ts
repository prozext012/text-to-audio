import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTTSAudio, answerMysteryQuestion } from './src/server/geminiCore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Endpoint: POST /api/tts
// Uses model: gemini-3.8-flash-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore', style = 'Warm, expressive, natural Indonesian storyteller explaining digital technology clearly' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS generation' });
    }

    const result = await generateTTSAudio(text, voice, style);
    return res.json(result);
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

    const result = await answerMysteryQuestion(question, voice);
    return res.json(result);
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
