import { useState, useRef, useEffect } from 'react';
import { Camera, Search, Leaf, Info, Loader2, BookOpen, AlertCircle, Compass, Star, ChevronRight, Image as ImageIcon, Download } from 'lucide-react';

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

const forceDownload = async (url, filename, e) => {
  e.stopPropagation();
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename || 'plant-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, '_blank');
  }
};

function ExploreTab({ onSearch }) {
  const [topPlants, setTopPlants] = useState([
    { title: 'Bonsai', label: 'Bonsai Tree', desc: 'The ancient Japanese art of growing miniature trees in containers.', img: null },
    { title: 'Monstera deliciosa', label: 'Monstera', desc: 'Famous for its natural leaf holes and tropical vibe.', img: null },
    { title: 'Dracaena trifasciata', label: 'Snake Plant', desc: 'Incredibly resilient air purifier that thrives on neglect.', img: null },
    { title: 'Lavandula', label: 'Lavender', desc: 'Known worldwide for its calming, therapeutic fragrance.', img: null },
    { title: 'Spathiphyllum', label: 'Peace Lily', desc: 'Beautiful white blooms year-round and great for air quality.', img: null },
    { title: 'Ficus lyrata', label: 'Fiddle-leaf Fig', desc: 'Popular houseplant featuring massive, leathery leaves.', img: null },
    { title: 'Aloe vera', label: 'Aloe Vera', desc: 'A hardy succulent plant species historically known for medicinal uses.', img: null },
    { title: 'Epipremnum aureum', label: 'Golden Pothos', desc: 'An almost indestructible trailing vine with heart-shaped leaves.', img: null },
    { title: 'Zamioculcas', label: 'ZZ Plant', desc: 'Tolerates extremely low light and requires highly infrequent watering.', img: null },
    { title: 'Chlorophytum comosum', label: 'Spider Plant', desc: 'Produces tiny ornamental plantlets on long trailing stems.', img: null },
  ]);

  const carouselRef = useRef(null);

  useEffect(() => {
    topPlants.forEach((plant, index) => {
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plant.title)}`)
        .then(r => r.json())
        .then(data => {
          if (data.originalimage) {
            setTopPlants(prev => {
              const newArr = [...prev];
              newArr[index].img = data.originalimage.source;
              return newArr;
            });
          } else if (data.thumbnail) {
            setTopPlants(prev => {
              const newArr = [...prev];
              newArr[index].img = data.thumbnail.source;
              return newArr;
            });
          }
        });
    });
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        const maxScroll = scrollWidth - clientWidth;
        if (scrollLeft >= maxScroll - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3500); // Scroll every 3.5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Top 10 Plants Shelf */}
      <div className="pt-8">
        <div className="px-4 mb-6 flex flex-col gap-1">
          <h3 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-400 drop-shadow-sm" fill="currentColor" size={28} /> Top 10 of the Week
          </h3>
          <p className="text-gray-500 font-medium text-sm">Swipe to explore the most searched botanical species globally.</p>
        </div>
        
        <div className="relative">
          {/* Side-shelf fade masks to indicate scrolling */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

          <div ref={carouselRef} className="flex overflow-x-auto gap-5 snap-x snap-mandatory px-6 pb-8 hide-scrollbar scroll-smooth">
            {topPlants.map((plant, idx) => (
              <div 
                key={idx} 
                onClick={() => onSearch(plant.label || plant.title)}
                className="snap-center shrink-0 w-[280px] md:w-[320px] bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100 active:scale-95 transition-transform cursor-pointer relative group"
              >
                <div className="w-full h-[400px] bg-gray-900 relative overflow-hidden">
                  {plant.img ? (
                    <img 
                      src={plant.img} 
                      alt={plant.label} 
                      className="w-full h-full object-cover animate-in fade-in duration-1000 opacity-90 group-hover:scale-110 transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-green-500" size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent"></div>
                  
                  {/* Rank Badge */}
                  <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-xl text-white w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border border-white/30 shadow-[0_4px_10px_rgba(0,0,0,0.3)] z-10">
                    #{idx + 1}
                  </div>

                  {/* Download Button */}
                  {plant.img && (
                    <button 
                      onClick={(e) => forceDownload(plant.img, `${plant.title.replace(/ /g, '_')}.jpg`, e)}
                      className="absolute top-5 right-5 bg-black/40 hover:bg-green-500 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors border border-white/20 shadow-lg z-20"
                      title="Download Image"
                    >
                      <Download size={20} />
                    </button>
                  )}

                  <div className="absolute bottom-0 left-0 p-6 w-full transform group-hover:-translate-y-2 transition-transform duration-500 ease-out z-10">
                    <h4 className="font-black text-white text-3xl mb-2 drop-shadow-lg">{plant.label}</h4>
                    <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed drop-shadow-md">{plant.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-green-400 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Learn More <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
          <style>{`
            @keyframes scan {
              0% { top: 0%; opacity: 0; }
              10% { opacity: 1; }
              50% { top: 100%; opacity: 1; }
              90% { opacity: 1; }
              100% { top: 0%; opacity: 0; }
            }
          `}</style>
          
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-black">
            <img 
              src={imageSrc} 
              alt="Preview" 
              className={`w-full max-h-[60vh] object-contain transition duration-500 ${loading ? 'opacity-50 blur-[2px] saturate-50' : ''}`} 
            />
            
            {loading && (
              <>
                <div className="absolute left-0 w-full h-[2px] bg-green-400 shadow-[0_0_15px_4px_rgba(74,222,128,1)] animate-[scan_2.5s_ease-in-out_infinite] z-10" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75"></div>
                    <div className="relative bg-green-600 text-white p-4 rounded-full shadow-[0_0_30px_rgba(22,163,74,0.8)] border-2 border-green-300">
                      <Leaf size={32} className="animate-pulse" />
                    </div>
                  </div>
                  <p className="mt-6 text-white font-black tracking-widest uppercase text-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-pulse">
                    Analyzing Pattern...
                  </p>
                </div>
              </>
            )}

            {!loading && (
              <button 
                onClick={() => { setImageSrc(null); setImageFile(null); setResult(null); setError(null); }}
                className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md"
              >
                Retake
              </button>
            )}
          </div>
          
          {!result && !loading && (
            <button 
              onClick={identifyPlant}
              className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 hover:bg-green-700 transition flex justify-center items-center gap-2 text-lg"
            >
              <Search /> Identify Plant
            </button>
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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [wikiData, setWikiData] = useState(null);
  const [wikiMedia, setWikiMedia] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialQuery) {
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  // Autocomplete fetcher
  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=5&namespace=0&format=json&origin=*`);
        const data = await res.json();
        setSuggestions(data[1] || []);
      } catch (e) {
        console.error("Autocomplete error", e);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const executeSearch = async (searchStr) => {
    if (!searchStr.trim()) return;
    
    setQuery(searchStr);
    setShowSuggestions(false);
    setLoading(true);
    setError(null);
    setWikiData(null);
    setWikiMedia([]);

    try {
      // 1. Intelligent AI Query Resolution
      const aiRes = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchStr })
      });
      
      if (!aiRes.ok) throw new Error('AI Search failed to resolve query.');
      const aiData = await aiRes.json();

      if (!aiData.isPlant) {
        setError(aiData.reasoning || `"${searchStr}" does not appear to be a plant. Please search for botanical subjects.`);
        setLoading(false);
        return;
      }

      const exactWikiTitle = aiData.wikipediaTitle;

      // 2. Fetch rich summary from Wikipedia REST API using the AI-resolved title
      const summaryRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(exactWikiTitle.replace(/ /g, '_'))}`);
      if (!summaryRes.ok) throw new Error(`Could not find Wikipedia data for "${exactWikiTitle}"`);
      const summaryData = await summaryRes.json();
      
      if (summaryData.type === 'disambiguation') {
        setError(`"${exactWikiTitle}" is too broad. Please be more specific.`);
        setLoading(false);
        return;
      }

      setWikiData(summaryData);

      // 3. Fetch media gallery for this page
      const mediaRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(summaryData.title.replace(/ /g, '_'))}`);
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        const photos = mediaData.items
          .filter(item => item.type === 'image' && (item.title.toLowerCase().endsWith('.jpg') || item.title.toLowerCase().endsWith('.jpeg') || item.title.toLowerCase().endsWith('.png')))
          .map(item => {
            let src = item.srcset && item.srcset.length > 0 ? item.srcset[item.srcset.length - 1].src : (item.source?.src || '');
            if (src.startsWith('//')) {
              src = 'https:' + src;
            }
            return src;
          })
          .filter(src => src.startsWith('http'))
          .slice(0, 4); // Take top 4 photos
        
        setWikiMedia(photos);
      }
    } catch (err) {
      console.error(err);
      setError(`Our AI Botanist could not find encyclopedia records for "${searchStr}".`);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    executeSearch(query);
  };

  return (
    <div className="flex flex-col gap-6 p-4 animate-in fade-in duration-500">
      <div className="text-center mt-2">
        <h2 className="text-3xl font-black text-green-800 mb-2 tracking-tight">Wiki Explorer</h2>
        <p className="text-gray-600 text-sm">Search the world's largest encyclopedia for comprehensive botanical details.</p>
      </div>

      <div className="relative z-30">
        <form onSubmit={onSubmit} className="relative">
          <input 
            type="text" 
            placeholder="e.g. Monstera deliciosa..."
            className="w-full bg-white border-2 border-green-200 rounded-2xl py-4 pl-12 pr-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)] focus:outline-none focus:border-green-500 transition font-medium text-lg"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400" size={24} />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded-xl transition font-bold shadow-md">
            Search
          </button>
        </form>

        {/* Autocomplete Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2">
            {suggestions.map((sug, idx) => (
              <div 
                key={idx} 
                onClick={() => executeSearch(sug)}
                className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-800 font-medium border-b border-gray-50 last:border-0 flex items-center gap-3 transition"
              >
                <Search size={16} className="text-gray-400" />
                {sug}
              </div>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 size={48} className="animate-spin text-green-500 mb-4" />
          <p className="font-bold text-green-600 animate-pulse">Searching encyclopedia...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center shadow-sm">
          <AlertCircle size={32} className="mx-auto mb-3 text-red-400" />
          <p className="font-bold">{error}</p>
        </div>
      )}

      {wikiData && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-8">
          
          {/* Main Hero Image */}
          {wikiData.originalimage ? (
            <div className="w-full h-80 relative bg-gray-900 group">
              <img src={wikiData.originalimage.source} alt={wikiData.title} className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
              
              <button 
                onClick={(e) => forceDownload(wikiData.originalimage.source, `${wikiData.title.replace(/ /g, '_')}_Hero.jpg`, e)}
                className="absolute top-4 right-4 bg-black/40 hover:bg-green-500 backdrop-blur-md text-white p-3 rounded-full transition-colors border border-white/20 shadow-lg opacity-0 group-hover:opacity-100 z-20"
                title="Download High-Res Image"
              >
                <Download size={20} />
              </button>

              <div className="absolute bottom-0 left-0 p-6 w-full pointer-events-none">
                <h3 className="text-4xl font-black text-white drop-shadow-md mb-1">{wikiData.title}</h3>
                {wikiData.description && (
                  <p className="text-green-300 font-bold uppercase tracking-widest text-sm drop-shadow-md flex items-center gap-2">
                    <Leaf size={16} /> {wikiData.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-green-50 border-b border-green-100">
              <h3 className="text-4xl font-black text-green-900 mb-1">{wikiData.title}</h3>
              {wikiData.description && (
                <p className="text-green-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                  <Leaf size={16} /> {wikiData.description}
                </p>
              )}
            </div>
          )}

          <div className="p-6">
            <div 
              className="text-gray-700 text-base md:text-lg leading-relaxed prose prose-green max-w-none font-medium mb-8"
              dangerouslySetInnerHTML={{ __html: wikiData.extract_html }}
            />
            
            {/* Gallery Grid */}
            {wikiMedia.length > 1 && (
              <div className="mb-8">
                <h4 className="font-black text-xl text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <ImageIcon className="text-green-500" /> Botanical Gallery
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {wikiMedia.map((src, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden shadow-sm h-40 bg-gray-100 relative group">
                      <img src={src} alt="Gallery item" className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition duration-300"></div>
                      <button 
                        onClick={(e) => forceDownload(src, `${wikiData.title.replace(/ /g, '_')}_Gallery_${idx+1}.jpg`, e)}
                        className="absolute bottom-2 right-2 bg-black/50 hover:bg-green-500 backdrop-blur-md text-white p-2 rounded-full transition-colors border border-white/20 opacity-0 group-hover:opacity-100"
                        title="Download Image"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <a 
              href={wikiData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${wikiData.title}`}
              target="_blank" 
              rel="noreferrer"
              className="block w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 px-6 rounded-2xl text-center shadow-lg shadow-green-200 transition"
            >
              Read full article on Wikipedia ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
