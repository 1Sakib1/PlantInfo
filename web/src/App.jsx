import { useState, useRef, useEffect } from 'react';
import { Camera, Search, Leaf, Info, Loader2, BookOpen, AlertCircle, Compass, Star, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore'); 
  const [autoSearchQuery, setAutoSearchQuery] = useState('');

  const handleExploreSearch = (query) => {
    setAutoSearchQuery(query);
    setActiveTab('search');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-green-600 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Leaf size={24} className="animate-pulse" />
          <h1 className="text-xl font-bold tracking-wide">PlantInfo AI</h1>
        </div>
        <div className="bg-green-700/50 px-3 py-1 rounded-full text-xs font-bold border border-green-500">
          Pro
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        {activeTab === 'explore' && <ExploreTab onSearch={handleExploreSearch} />}
        {activeTab === 'scan' && <ScanTab />}
        {activeTab === 'search' && <SearchTab initialQuery={autoSearchQuery} />}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-3 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setActiveTab('explore')} 
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'explore' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
        >
          <Compass size={24} strokeWidth={activeTab === 'explore' ? 2.5 : 2} />
          <span className="text-xs font-semibold">Explore</span>
        </button>
        <button 
          onClick={() => setActiveTab('scan')} 
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'scan' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
        >
          <Camera size={24} strokeWidth={activeTab === 'scan' ? 2.5 : 2} />
          <span className="text-xs font-semibold">Scan AI</span>
        </button>
        <button 
          onClick={() => setActiveTab('search')} 
          className={`flex flex-col items-center gap-1 w-20 transition ${activeTab === 'search' ? 'text-green-600' : 'text-gray-400 hover:text-green-500'}`}
        >
          <Search size={24} strokeWidth={activeTab === 'search' ? 2.5 : 2} />
          <span className="text-xs font-semibold">Wiki</span>
        </button>
      </nav>
    </div>
  );
}

function ExploreTab({ onSearch }) {
  const trendingPlants = [
    { name: 'Monstera Deliciosa', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Monstera_deliciosa3.jpg/800px-Monstera_deliciosa3.jpg', desc: 'Famous for its natural leaf holes.' },
    { name: 'Snake Plant', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Snake_plant.jpg/800px-Snake_plant.jpg', desc: 'Incredibly resilient air purifier.' },
    { name: 'Lavender', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Single_lavendar_flower02.jpg/800px-Single_lavendar_flower02.jpg', desc: 'Known for its calming fragrance.' },
    { name: 'Peace Lily', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Spathiphyllum_floribundum1.jpg/800px-Spathiphyllum_floribundum1.jpg', desc: 'Beautiful white blooms year-round.' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      {/* Plant of the week hero */}
      <div className="relative h-72 w-full bg-gray-200">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Bonsai_Trident_Maple.jpg/800px-Bonsai_Trident_Maple.jpg" 
          alt="Plant of the week" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <Star size={16} fill="currentColor" />
            <span className="text-xs font-bold uppercase tracking-widest">Plant of the Week</span>
          </div>
          <h2 className="text-3xl font-black mb-1">Bonsai Tree</h2>
          <p className="text-sm text-gray-200 mb-3 line-clamp-2">The ancient Japanese art of growing miniature trees in containers, representing peace, balance, and harmony.</p>
          <button 
            onClick={() => onSearch('Bonsai')}
            className="bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center gap-1 transition"
          >
            Learn More <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Trending Section */}
      <div className="p-4 pt-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Trending Species</h3>
        <div className="grid grid-cols-2 gap-4">
          {trendingPlants.map((plant, idx) => (
            <div 
              key={idx} 
              onClick={() => onSearch(plant.name)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 active:scale-95 transition cursor-pointer"
            >
              <img src={plant.img} alt={plant.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h4 className="font-bold text-gray-800 text-sm">{plant.name}</h4>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{plant.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ScanTab() {
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

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

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1600;
          const MAX_HEIGHT = 1600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const identifyPlant = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    try {
      const imageBase64 = await compressImage(imageFile);
      
      const response = await fetch('/api/identify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64 })
      });

      if (!response.ok) {
        throw new Error('Failed to identify plant. Server returned ' + response.status);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Failed to identify plant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in duration-500">
      <div className="text-center mt-2">
        <h2 className="text-2xl font-black text-green-800 mb-2">Identify any plant</h2>
        <p className="text-gray-600 text-sm">Take a photo or upload an image to instantly identify plants using AI.</p>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        ref={cameraInputRef}
        onChange={handleImageCapture}
      />
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={galleryInputRef}
        onChange={handleImageCapture}
      />

      {!imageSrc ? (
        <div className="flex flex-col gap-4 mt-4">
          <div 
            onClick={() => cameraInputRef.current.click()}
            className="border-2 border-green-500 rounded-3xl p-8 flex flex-col items-center justify-center text-white bg-green-500 cursor-pointer hover:bg-green-600 transition shadow-md"
          >
            <Camera size={48} className="mb-3" />
            <span className="font-bold text-lg">Take Photo</span>
          </div>
          <div 
            onClick={() => galleryInputRef.current.click()}
            className="border-2 border-dashed border-gray-300 rounded-3xl p-6 flex flex-col items-center justify-center text-gray-600 bg-white cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition shadow-sm"
          >
            <ImageIcon size={32} className="mb-2 text-gray-400" />
            <span className="font-bold">Upload from Gallery</span>
          </div>
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

function SearchTab({ initialQuery }) {
  const [query, setQuery] = useState(initialQuery || '');
  const [loading, setLoading] = useState(false);
  const [wikiData, setWikiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      searchWikiText(initialQuery);
    }
  }, [initialQuery]);

  const searchWikiText = async (searchStr) => {
    if (!searchStr.trim()) return;
    
    setLoading(true);
    setError(null);
    setWikiData(null);

    try {
      const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&titles=${encodeURIComponent(searchStr)}&exintro=1&pithumbsize=600&origin=*`);
      const data = await res.json();
      
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      
      if (pageId === '-1') {
        setError(`No botanical or general Wikipedia entry found for "${searchStr}".`);
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

  const onSubmit = (e) => {
    e.preventDefault();
    searchWikiText(query);
  };

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in duration-500">
      <div className="text-center mt-2">
        <h2 className="text-2xl font-black text-green-800 mb-2">Wiki Explorer</h2>
        <p className="text-gray-600 text-sm">Search the world's largest encyclopedia for comprehensive plant details.</p>
      </div>

      <form onSubmit={onSubmit} className="relative">
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mt-2 animate-in slide-in-from-bottom-4">
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
              className="mt-6 inline-block bg-green-50 hover:bg-green-100 text-green-800 font-bold py-2 px-4 rounded-lg text-sm transition w-full text-center border border-green-200"
            >
              Read full article on Wikipedia ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
