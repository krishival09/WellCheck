import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Lazy initialize Gemini client
  let geminiClient: GoogleGenAI | null = null;
  const getGemini = (): GoogleGenAI | null => {
    if (!geminiClient && process.env.GEMINI_API_KEY) {
      geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
    return geminiClient;
  };

  // Translation Cache in memory
  const translationCache = new Map<string, string>();

  // Map language codes to Google Translate / ISO 639-1 codes
  const getTranslateLangCode = (langCode: string): string => {
    const map: Record<string, string> = {
      'hi-IN': 'hi',
      'te-IN': 'te',
      'mr-IN': 'mr',
      'bn-IN': 'bn',
      'ta-IN': 'ta',
      'gu-IN': 'gu',
      'kn-IN': 'kn',
      'ml-IN': 'ml',
      'pa-IN': 'pa',
      'or-IN': 'or',
      'en-US': 'en',
      'es-ES': 'es',
      'fr-FR': 'fr',
      'de-DE': 'de',
      'ja-JP': 'ja',
      'ar-SA': 'ar',
      'zh-CN': 'zh-CN',
      'zh-HK': 'zh-TW',
      'vi-VN': 'vi',
      'tl-PH': 'tl',
    };
    return map[langCode] || langCode.split('-')[0] || 'en';
  };

  // Google Translate API Endpoint
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang, sourceLang = 'en' } = req.body || {};
      if (!text || typeof text !== 'string') {
        res.status(400).json({ error: 'Text string is required for translation' });
        return;
      }

      const target = getTranslateLangCode(targetLang || 'en');
      const source = getTranslateLangCode(sourceLang);

      if (target === source || !text.trim()) {
        res.json({ translatedText: text, source, target });
        return;
      }

      const cacheKey = `${source}:${target}:${text.trim()}`;
      if (translationCache.has(cacheKey)) {
        res.json({ translatedText: translationCache.get(cacheKey), source, target, cached: true });
        return;
      }

      let translatedResult = '';

      // 1. First Priority: Google Cloud Translation API v2 if key is configured
      const googleTranslateKey = process.env.GOOGLE_TRANSLATE_API_KEY;
      if (googleTranslateKey) {
        try {
          const url = `https://translation.googleapis.com/language/translate/v2?key=${googleTranslateKey}`;
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              q: text,
              target,
              source: source !== 'auto' ? source : undefined,
              format: 'text',
            }),
          });
          if (response.ok) {
            const data = await response.json();
            const translations = data?.data?.translations;
            if (translations && translations.length > 0 && translations[0].translatedText) {
              translatedResult = translations[0].translatedText;
            }
          }
        } catch (gtErr) {
          console.warn('Google Cloud Translation API request failed:', gtErr);
        }
      }

      // 2. Second Priority: Google Gemini AI translation if available
      if (!translatedResult) {
        const ai = getGemini();
        if (ai) {
          try {
            const prompt = `Translate the following user text directly from ${source} into ${target} language naturally and concisely for an elderly care emergency and wellness app. Output ONLY the translated text, with no explanations or punctuation additions:\n\n"${text}"`;
            const geminiRes = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });
            const candidateText = geminiRes.text?.trim();
            if (candidateText) {
              // Strip quotes if output by model
              translatedResult = candidateText.replace(/^["']|["']$/g, '').trim();
            }
          } catch (aiErr) {
            console.warn('Gemini translation fallback error:', aiErr);
          }
        }
      }

      // If translation succeeded, save to cache and return
      if (translatedResult) {
        if (translationCache.size > 200) {
          const firstKey = translationCache.keys().next().value;
          if (firstKey) translationCache.delete(firstKey);
        }
        translationCache.set(cacheKey, translatedResult);
        res.json({ translatedText: translatedResult, source, target });
        return;
      }

      // Fallback: return original text if services are not yet configured with keys
      res.json({ translatedText: text, source, target, fallback: true });
    } catch (err: unknown) {
      console.error('Translation endpoint error:', err);
      res.status(500).json({ error: 'Translation failed', details: err instanceof Error ? err.message : String(err) });
    }
  });

  // Audio Cache in memory to make repeated prompts instant
  const ttsAudioCache = new Map<string, { buffer: Buffer; contentType: string }>();

  // Map language codes to TTS service codes
  const getTtsLangCode = (langCode: string): string => {
    const map: Record<string, string> = {
      'hi-IN': 'hi',
      'te-IN': 'te',
      'mr-IN': 'mr',
      'bn-IN': 'bn',
      'ta-IN': 'ta',
      'gu-IN': 'gu',
      'kn-IN': 'kn',
      'ml-IN': 'ml',
      'pa-IN': 'pa',
      'or-IN': 'hi', // Odia falls back to Hindi phonetics for high-clarity voice
      'en-US': 'en',
      'es-ES': 'es',
      'fr-FR': 'fr',
      'de-DE': 'de',
      'ja-JP': 'ja',
      'ar-SA': 'ar',
      'zh-CN': 'zh-CN',
      'zh-HK': 'zh-TW',
      'vi-VN': 'vi',
      'tl-PH': 'tl',
    };
    return map[langCode] || langCode.split('-')[0] || 'en';
  };

  // High-fidelity Multi-Language TTS Proxy Endpoint
  app.get('/api/tts', async (req, res) => {
    const text = (req.query.text as string || '').trim();
    const lang = (req.query.lang as string || 'en-US').trim();

    if (!text) {
      res.status(400).json({ error: 'Text query parameter is required' });
      return;
    }

    const ttsLang = getTtsLangCode(lang);
    const cacheKey = `${ttsLang}:${text}`;

    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey)!;
      res.setHeader('Content-Type', cached.contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(cached.buffer);
      return;
    }

    try {
      // Chunk long text if needed (Google Translate TTS supports up to ~200 chars per chunk)
      const encodedText = encodeURIComponent(text.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=${ttsLang}&client=tw-ob`;
      
      const response = await fetch(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
      });

      if (!response.ok) {
        throw new Error(`TTS upstream responded with status ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'audio/mpeg';

      // Store in memory cache (limit size to 100 entries)
      if (ttsAudioCache.size > 100) {
        const firstKey = ttsAudioCache.keys().next().value;
        if (firstKey) ttsAudioCache.delete(firstKey);
      }
      ttsAudioCache.set(cacheKey, { buffer, contentType });

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.send(buffer);
    } catch (err: unknown) {
      console.warn('TTS streaming fallback error:', err);
      res.status(502).json({ 
        error: 'Failed to fetch upstream TTS audio',
        details: err instanceof Error ? err.message : String(err)
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WellCheck server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
