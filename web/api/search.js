import { GoogleGenAI } from '@google/genai';

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  const { query } = req.body || {};

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing search query.' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
       console.error("CRITICAL: GEMINI_API_KEY environment variable is missing.");
       return res.status(500).json({ error: 'Internal Server Error: Missing configuration.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        `You are a brilliant AI botanist. The user searched for: "${query}". 
        Determine if this query is a plant, a flower, a tree, or related to botany. 
        If it is, figure out the exact English Wikipedia article title for this plant (e.g. "Monstera deliciosa", "Apple", "Venus flytrap").
        If the query is a description or a vague term (e.g. "the flower that smells like a corpse"), intelligently identify the correct plant (e.g. "Titan arum").
        If the user searches for ambiguous terms like "Apple", assume they mean the fruit/tree ("Apple"), not the tech company.
        If the query is completely unrelated to plants or botany (e.g. "Steve Jobs", "Car", "Python programming"), set isPlant to false.
        
        Return ONLY valid JSON matching this schema:
        {
          "isPlant": boolean,
          "wikipediaTitle": "The exact Wikipedia article title (case-sensitive) to fetch, or null",
          "commonName": "Common name of the plant, or null",
          "reasoning": "Brief explanation of what you found or why it was rejected"
        }`
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
    console.error('Gemini Search API Error:', error);
    return res.status(500).json({ error: 'AI Botanist failed to analyze the search query.' });
  }
}
