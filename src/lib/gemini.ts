import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function analyzeAncientText(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `Bu görüntüdeki antik yazıyı analiz et. Lütfen şunları belirle:
1. Hangi antik yazı sistemi kullanılmış (Sümer, Mısır Hiyeroglifleri, Yunanca, vb.)
2. Metnin transkripsionu (okunabiliyorsa)
3. Türkçe çevirisi
4. Dönem ve bölge tahmini
5. Güven skoru (0-100)

JSON formatında yanıt ver:
{
  "scriptType": "tespit edilen yazı sistemi",
  "originalText": "transkripsiyon",
  "translation": "türkçe çeviri",
  "period": "dönem bilgisi",
  "region": "bölge",
  "confidence": güven_skoru_sayı,
  "notes": "ek notlar"
}`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    },
  ]);

  const response = result.response.text();
  const jsonMatch = response.match(/\{[\s\S]*\}/);

  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  return {
    scriptType: 'Belirlenemedi',
    originalText: '',
    translation: response,
    period: '',
    region: '',
    confidence: 0,
    notes: response,
  };
}

export async function chatWithGemini(message: string, history: Array<{ role: string; content: string }>) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
}
