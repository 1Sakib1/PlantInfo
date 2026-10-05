import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const mimeType = imageBase64.split(';')[0].split(':')[1];
    const data = imageBase64.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        "You are an expert botanist and encyclopedist. Identify the plant in this image. Return ONLY a valid JSON object with the following schema: { \"name\": \"Common Name\", \"scientificName\": \"Scientific name\", \"family\": \"Plant family\", \"description\": \"Detailed wikipedia-style description of the plant, its origin, and characteristics.\", \"uses\": [\"use 1\", \"use 2\"] }. Do not include markdown blocks or any other text.",
        {
          inlineData: {
            data,
            mimeType
          }
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Failed to process image' });
  }
}
