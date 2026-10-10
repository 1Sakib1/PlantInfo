import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  const { query } = req.body || {};
  if (!query || typeof query !== 'string' || query.trim().length < 2) return res.status(400).json({ suggestions: [] });

  try {
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ suggestions: [] });
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [
        `You are a botanical autocomplete engine. The user has typed the prefix: "${query}". Provide exactly 5 English Wikipedia article titles of plants, flowers, or trees that start with or closely match this prefix. If the prefix is ambiguous (like "Apple"), return ONLY the plant versions. If completely unrelated, return an empty array. Do NOT return anything other than a JSON array of strings.`
      ],
      config: { responseMimeType: 'application/json' }
    });
    let rawText = response.text || '[]';
    rawText = rawText.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    const suggestions = JSON.parse(rawText);
    return res.status(200).json({ suggestions });
  } catch (error) {
    return res.status(500).json({ suggestions: [] });
  }
}


