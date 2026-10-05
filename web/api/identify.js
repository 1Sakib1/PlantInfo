import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 60, // Maximum execution time in seconds
};

export default async function handler(req, res) {
  // CORS Headers (Restricting to same-origin and explicitly rejecting others if this was a decoupled backend)
  // Since it's hosted on Vercel next to the frontend, Vercel handles standard routing.
  
  // 1. HTTP Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  const { imageBase64 } = req.body || {};

  // 2. Strict Input Type Validation & Sanitization
  if (!imageBase64 || typeof imageBase64 !== 'string' || !imageBase64.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid or missing image payload. Must be a valid base64 data URI.' });
  }

  // 3. Payload Size Limitation (Prevent DoS via memory exhaustion)
  // 4MB limit to stay comfortably under Vercel's 4.5MB Serverless function payload limit
  if (imageBase64.length > 4 * 1024 * 1024) { 
    return res.status(413).json({ error: 'Payload too large. Please compress the image further.' });
  }

  try {
    // 4. Secure Environment Variable usage
    if (!process.env.GEMINI_API_KEY) {
       console.error("CRITICAL: GEMINI_API_KEY environment variable is missing.");
       return res.status(500).json({ error: 'Internal Server Error: Missing configuration.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Safely parse mimeType and data
    const parts = imageBase64.split(';');
    if (parts.length < 2) throw new Error("Malformed data URI");
    
    const mimeTypePart = parts[0].split(':');
    if (mimeTypePart.length < 2) throw new Error("Malformed MIME type");
    const mimeType = mimeTypePart[1];

    const dataPart = parts[1].split(',');
    if (dataPart.length < 2) throw new Error("Malformed base64 data");
    const data = dataPart[1];

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
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

    let rawText = response.text || '';
    rawText = rawText.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
    const result = JSON.parse(rawText);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Gemini API Error:', error);
    // 5. Do not leak internal stack traces to the client
    return res.status(500).json({ error: 'Failed to process image. Our AI botanist encountered an error.' });
  }
}
