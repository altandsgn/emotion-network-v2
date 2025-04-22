'use client';

import { useState, useEffect } from 'react';
import { Footprint } from '../types/footprint';
import Navbar from '../components/Navbar';
import PixelCursor from '../components/PixelCursor';

const emotionColors = {
  anger: '#FF073A',    // Neon Red
  disgust: '#66FF00',  // Neon Green
  fear: '#B967FF',     // Neon Purple
  happiness: '#FFFF00', // Neon Yellow
  sadness: '#0099FF',  // Neon Blue
  surprise: '#FF6EC7'  // Neon Pink
} as const;

export default function Archive() {
  const [selectedEmotions, setSelectedEmotions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/submissions?limit=100');
        const data = await response.json();
        
        if (response.ok) {
          const approvedFootprints = data.submissions.map((sub: any) => ({
            id: sub.id,
            message: sub.message,
            emotion: sub.emotion,
            location: sub.location,
            x: 0,
            y: 0,
            velocity: { x: 0, y: 0 },
            size: { width: 32, height: 32 }
          }));
          
          setFootprints(approvedFootprints);
        } else {
          setError('Failed to fetch submissions');
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
        setError('An error occurred while fetching submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const filteredFootprints = footprints.filter(footprint => {
    const matchesEmotion = selectedEmotions.size === 0 || (footprint.emotion && selectedEmotions.has(footprint.emotion));
    const matchesSearch = searchQuery === '' || 
      footprint.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (footprint.location?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesEmotion && matchesSearch;
  });

  if (loading) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <Navbar currentPath="/archive" />
        <PixelCursor />
        <div className="flex items-center justify-center h-screen">
          <div className="text-green-500 font-mono">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen relative overflow-hidden">
        <Navbar currentPath="/archive" />
        <PixelCursor />
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-500 font-mono">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar currentPath="/archive" />
      <PixelCursor />
      
      <main className="min-h-screen px-[120px] pt-16 pb-[64px] cursor-none">
        {/* Title Section */}
        <div className="mt-16 space-y-12">
          <div className="space-y-6">
            <h1 className="text-green-500 font-mono text-3xl">
              A Complete Archive of Collective Thoughts
            </h1>
            <p className="text-green-500/90 font-mono text-base">
              This archive holds every emotion, every whispered thought, and every silent reflection shared by our community. 
              Each message here is a reminder that, although deeply personal, our feelings resonate with many others.
            </p>
            <p className="text-green-500/80 font-mono text-sm mt-3">
              Take your time, explore freely, and find comfort in these collective echoes...
            </p>
          </div>

          {/* Filter and Search Section */}
          <div className="h-[70px] w-full flex items-center gap-16">
            {/* Filter Section */}
            <div className="flex-1">
              <div className="space-y-5">
                <h2 className="text-green-500 font-mono text-xs">Filter Emotions:</h2>
                <div className="flex justify-between">
                  {Object.entries(emotionColors).map(([emotion, color]) => (
                    <button
                      key={emotion}
                      onClick={() => {
                        const newSelected = new Set(selectedEmotions);
                        if (newSelected.has(emotion)) {
                          newSelected.delete(emotion);
                        } else {
                          newSelected.add(emotion);
                        }
                        setSelectedEmotions(newSelected);
                      }}
                      className={`w-[128px] flex items-center gap-3 p-2 rounded-lg transition-all ${
                        selectedEmotions.has(emotion) ? 'bg-black/20' : ''
                      }`}
                    >
                      <div className="relative">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="transition-transform duration-200">
                          <circle
                            cx="16"
                            cy="16"
                            r="12"
                            fill={color}
                            fillOpacity={selectedEmotions.has(emotion) ? "0.4" : "0.2"}
                            className="transition-all duration-200"
                          />
                          <path 
                            d="M14 4h4v2h-4zM10 6h4v2h-4zM18 6h4v2h-4zM8 8h2v2H8zM22 8h2v2h-2zM6 10h2v4H6zM24 10h2v4h-2zM4 14h2v4H4zM26 14h2v4h-2zM6 18h2v4H6zM24 18h2v4h-2zM8 22h2v2H8zM22 22h2v2h-2zM10 24h4v2h-4zM18 24h4v2h-4zM14 26h4v2h-4z"
                            fill={color}
                            fillOpacity={selectedEmotions.has(emotion) ? "0.9" : "0.6"}
                            className="transition-all duration-200"
                          />
                        </svg>
                        {selectedEmotions.has(emotion) && (
                          <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                              boxShadow: `0 0 10px ${color}`,
                              animation: 'pulse 2s infinite'
                            }}
                          />
                        )}
                      </div>
                      <span className="text-green-500 font-mono text-sm first-letter:uppercase">
                        {emotion}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-[320px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a keyword..."
                className="w-full h-[40px] bg-black/50 border border-green-500 rounded px-3 text-green-500 font-mono focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-green-500/40"
              />
            </div>
          </div>

          {/* Separator Line */}
          <div className="relative">
            <div className="h-[2px] w-full bg-green-500/30" />
            <div className="absolute right-0 top-[14px] text-green-500/60 font-mono text-xs">
              {filteredFootprints.length} submissions
            </div>
          </div>

          {/* Submissions Grid with adjusted spacing */}
          <div style={{ marginTop: '80px' }} className="space-y-12">
            <div className="grid grid-cols-4 gap-8">
              {filteredFootprints.map((footprint) => (
                <div key={footprint.id} className="group relative">
                  {/* Emotion Dot */}
                  <div 
                    className="absolute left-1/2 -translate-x-1/2 -top-[48px] transition-all duration-200 group-hover:scale-110"
                    style={{ 
                      filter: `drop-shadow(0 0 8px ${emotionColors[footprint.emotion as keyof typeof emotionColors]})`
                    }}
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32">
                      <circle
                        cx="16"
                        cy="16"
                        r="12"
                        fill={emotionColors[footprint.emotion as keyof typeof emotionColors]}
                        fillOpacity="0.4"
                      />
                      <path 
                        d="M14 4h4v2h-4zM10 6h4v2h-4zM18 6h4v2h-4zM8 8h2v2H8zM22 8h2v2h-2zM6 10h2v4H6zM24 10h2v4h-2zM4 14h2v4H4zM26 14h2v4h-2zM6 18h2v4H6zM24 18h2v4h-2zM8 22h2v2H8zM22 22h2v2h-2zM10 24h4v2h-4zM18 24h4v2h-4zM14 26h4v2h-4z"
                        fill={emotionColors[footprint.emotion as keyof typeof emotionColors]}
                        fillOpacity="0.9"
                      />
                    </svg>
                  </div>

                  {/* Card Content */}
                  <div 
                    className="bg-black/20 border border-green-500/30 rounded p-4 font-mono min-h-[180px] flex flex-col transition-all duration-200 group-hover:border-green-500/50 group-hover:bg-black/30"
                  >
                    {/* ID Section */}
                    <div className="text-green-500 text-sm mb-4">
                      ID: <span className="text-green-500/60">anonymous</span>
                    </div>

                    {/* Message Section */}
                    <p className="text-green-500 mb-auto">{footprint.message}</p>

                    {/* Emotion Section */}
                    <div className="text-sm flex items-center gap-2 mt-4">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: emotionColors[footprint.emotion as keyof typeof emotionColors] }}
                      />
                      <span 
                        className="first-letter:uppercase"
                        style={{ color: emotionColors[footprint.emotion as keyof typeof emotionColors] }}
                      >
                        {footprint.emotion}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* End of Archive Message */}
            <div className="text-center">
              <span className="text-green-500/60 font-mono">end of archive...</span>
            </div>
          </div>

          {/* No Results Message */}
          {filteredFootprints.length === 0 && !loading && (
            <div className="text-center py-16">
              <span className="text-green-500/60 font-mono">No submissions found...</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
} 