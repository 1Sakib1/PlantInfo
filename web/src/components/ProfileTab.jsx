import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Leaf, Heart, LogOut, ArrowRight, Maximize2, Download } from 'lucide-react';

export default function ProfileTab({ user, onLogout, setFullscreenImage, forceDownload, onSearch }) {
  const [profile, setProfile] = useState(null);
  const [savedPlants, setSavedPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      const { data: plants } = await supabase
        .from('saved_plants')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (plants) setSavedPlants(plants);
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  const removePlant = async (id) => {
    await supabase.from('saved_plants').delete().eq('id', id);
    setSavedPlants(prev => prev.filter(p => p.id !== id));
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20">
        <Loader2 className="animate-spin text-green-500 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-10">
      <div className="bg-green-600 px-6 pt-10 pb-12 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Leaf size={120} />
        </div>
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-black text-white mb-2 tracking-tight">
              Hello,<br/>{profile?.username || 'Botanist'}
            </h2>
            <p className="text-green-100 font-medium">{savedPlants.length} plants in your collection</p>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); onLogout(); }}
            className="bg-white/20 hover:bg-white/30 p-3 rounded-full text-white backdrop-blur-md transition-all shadow-sm"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="px-6 mt-8">
        <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="text-red-500" fill="currentColor" /> My Collection
        </h3>

        {savedPlants.length === 0 ? (
          <div className="text-center bg-gray-100 rounded-3xl p-10 mt-10 border-2 border-dashed border-gray-200">
            <Leaf size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium mb-2">Your collection is empty.</p>
            <p className="text-sm text-gray-400">Search for plants and click the heart icon to save them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedPlants.map(plant => (
              <div key={plant.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col group relative">
                
                <div className="h-48 w-full bg-gray-900 relative cursor-pointer" onClick={() => setFullscreenImage(plant.image_url)}>
                  {plant.image_url ? (
                    <img src={plant.image_url} alt={plant.title} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <Leaf size={40} className="text-green-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); removePlant(plant.id); }}
                    className="absolute top-4 right-4 bg-red-500/80 hover:bg-red-600 text-white p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all"
                  >
                    <Heart size={16} fill="currentColor" />
                  </button>

                  <h4 className="absolute bottom-4 left-4 text-2xl font-black text-white drop-shadow-md z-10">{plant.title}</h4>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">{plant.label}</p>
                  <p className="text-gray-600 text-sm font-medium line-clamp-3 mb-4">{plant.description}</p>
                  
                  <div className="mt-auto flex gap-2">
                    <button 
                      onClick={() => onSearch(plant.title)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      Read Wiki <ArrowRight size={14} />
                    </button>
                    {plant.image_url && (
                      <button 
                        onClick={(e) => forceDownload(plant.image_url, `${plant.title.replace(/ /g, '_')}_Saved.jpg`, e)}
                        className="bg-green-100 hover:bg-green-200 text-green-700 p-2.5 rounded-xl transition-colors"
                      >
                        <Download size={18} />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
