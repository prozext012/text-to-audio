export interface TTSRequest {
  text: string;
  voice?: string;
  style?: string;
}

export interface TTSResponse {
  audioBase64: string;
  mimeType: string;
  cached?: boolean;
}

export async function requestTTS(req: TTSRequest): Promise<TTSResponse> {
  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal menghasilkan audio TTS (${response.status})`);
  }

  return response.json();
}

export async function askMystery(question: string, voice: string = 'Kore'): Promise<{ answer: string; audioBase64?: string }> {
  const response = await fetch('/api/ask-mystery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, voice }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Gagal mendapatkan jawaban misteri (${response.status})`);
  }

  return response.json();
}

/**
 * Helper to convert Base64 audio into an HTMLAudioElement or Blob URL
 */
export function createAudioFromBase64(base64: string, mimeType = 'audio/wav'): { audio: HTMLAudioElement; url: string; base64: string } {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  return { audio, url, base64 };
}

/**
 * Downloads audio as a .wav file directly to user device
 */
export function downloadAudioBase64(base64: string, filename: string, mimeType = 'audio/wav') {
  try {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const safeName = filename.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '-').toLowerCase();
    const finalFilename = safeName.endsWith('.wav') ? safeName : `${safeName || 'audio'}.wav`;

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = finalFilename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (err) {
    console.error('Download audio failed:', err);
  }
}
