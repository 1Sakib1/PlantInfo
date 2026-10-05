import { useState, useRef, useEffect } from 'react';
import { Camera, Search, Leaf, Info, Settings, Upload, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'search'
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('gemini_api_key'));

  return (
    <div className="min-h-screen pb-20 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf size={24} />
          <h1 className="text-xl font-bold tracking-wide">PlantInfo AI</h1>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 bg-green-700 hover:bg-green-800 rounded-full transition">
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {activeTab === 'scan' ? <ScanTab apiKey={apiKey} setShowSettings={setShowSettings} /> : <SearchTab />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
        <button 
          onClick={() => setActiveTab('scan')} 
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'scan' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
        >
          <Camera size={24} strokeWidth={activeTab === 'scan' ? 2.5 : 2} />
          <span className="text-xs font-semibold">Scan</span>
        </button>
        <button 
          onClick={() => setActiveTab('search')} 
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'search' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
        >
          <Search size={24} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
          <span className="text-xs font-semibold">Wiki</span>
        </button>
      </nav>

      {/* API Key Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Settings className="text-green-600" /> Setup AI Vision
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              To identify plants using computer vision, you need a free Google Gemini API Key.
            </p>
            <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-1 mb-6">
              <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
              <li>Sign in and click "Create API Key"</li>
              <li>Paste the key below</li>
            </ol>
            <input 
              type="password" 
              placeholder="AIzaSy..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('gemini_api_key', apiKey);
                  setShowSettings(false);
                }}
                className="flex-1 bg-green-600 text-white font-bold px-4 py-3 rounded-lg hover:bg-green-700 shadow-md shadow-green-200"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScanTab({ apiKey, setShowSettings }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setResult(null);
      setError(null);
    }
  };

  const fileToGenerativePart = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: file.type
          }
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const identifyPlant = async () => {
    if (!apiKey) {
      setShowSettings(true);
      return;
    }
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey });
      const imagePart = await fileToGenerativePart(imageFile);
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          "You are an expert botanist and encyclopedist. Identify the plant in this image. Return ONLY a valid JSON object with the following schema: { \"name\": \"Common Name\", \"scientificName\": \"Scientific name\", \"family\": \"Plant family\", \"description\": \"Detailed wikipedia-style description of the plant, its origin, and characteristics.\", \"uses\": [\"use 1\", \"use 2\"] }. Do not include markdown blocks or any other text.",
          imagePart
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to identify plant. Ensure your API key is valid and the image contains a plant.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-green-800 mb-2">Identify any plant</h2>
        <p className="text-gray-600">Take a photo or upload an image to instantly identify plants using AI.</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleImageCapture}
      />

      {!imageSrc ? (
        <div 
          onClick={() => fileInputRef.current.click()}
          className="border-4 border-dashed border-green-200 rounded-3xl p-12 flex flex-col items-center justify-center text-green-600 bg-white cursor-pointer hover:bg-green-50 hover:border-green-400 transition"
        >
          <Camera size={64} className="mb-4 opacity-80" />
          <span className="font-bold text-lg">Tap to open Camera</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-black">
            <img src={imageSrc} alt="Preview" className="w-full max-h-[60vh] object-contain" />
            <button 
              onClick={() => { setImageSrc(null); setImageFile(null); setResult(null); setError(null); }}
              className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
            >
              Retake
            </button>
          </div>
          
          {!result && !loading && (
            <button 
              onClick={identifyPlant}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition flex justify-center items-center gap-2 text-lg"
            >
              <Search /> Identify Plant
            </button>
          )}

          {loading && (
            <div className="flex flex-col items-center py-8 text-green-600">
              <Loader2 size={48} className="animate-spin mb-4" />
              <p className="font-bold animate-pulse">AI Botanist is analyzing...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex gap-3 border border-red-100">
              <AlertCircle className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mt-4 animate-in slide-in-from-bottom-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-3xl font-black text-gray-900">{result.name}</h3>
                  <p className="text-green-700 font-medium italic mt-1">{result.scientificName}</p>
                  {result.family && <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mt-1">Family: {result.family}</p>}
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-2 border-b pb-1">
                    <BookOpen size={18} className="text-green-600" /> Botanical Description
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{result.description}</p>
                </div>
                
                {result.uses && result.uses.length > 0 && (
                  <div>
                    <h4 className="flex items-center gap-2 font-bold text-gray-800 mb-2 border-b pb-1">
                      <Leaf size={18} className="text-green-600" /> Known Uses
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                      {result.uses.map((use, idx) => (
                        <li key={idx}>{use}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchTab() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [wikiData, setWikiData] = useState(null);
  const [error, setError] = useState(null);

  const searchWiki = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    setWikiData(null);

    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(query)}&exintro=1&pithumbsize=600&origin=*`);
      const data = await res.json();
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId === '-1') {
        setError(`No botanical or general Wikipedia entry found for "${query}".`);
      } else {
        setWikiData(pages[pageId]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch from Wikipedia.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-green-800 mb-2">Wiki Explorer</h2>
        <p className="text-gray-600">Search the world's largest encyclopedia for comprehensive plant details.</p>
      </div>

      <form onSubmit={searchWiki} className="relative">
        <input 
          type="text" 
          placeholder="e.g. Monstera deliciosa..."
          className="w-full bg-white border-2 border-green-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:border-green-500 transition font-medium"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" size={20} />
        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 text-green-700 hover:bg-green-200 p-2 rounded-xl transition font-bold text-sm">
          Search
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <Loader2 size={40} className="animate-spin text-green-500" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-sm text-center font-medium">
          {error}
        </div>
      )}

      {wikiData && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-2">
          {wikiData.thumbnail && (
            <img src={wikiData.thumbnail.source} alt={wikiData.title} className="w-full h-64 object-cover" />
          )}
          <div className="p-6">
            <h3 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <Info className="text-blue-500" /> {wikiData.title}
            </h3>
            <div 
              className="text-gray-600 text-sm leading-relaxed prose prose-green max-w-none"
              dangerouslySetInnerHTML={{ __html: wikiData.extract }}
            />
            <a 
              href={`https://en.wikipedia.org/?curid=${wikiData.pageid}`} 
              target="_blank" 
              rel="noreferrer"
              className="mt-6 inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg text-sm transition"
            >
              Read full article on Wikipedia ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
