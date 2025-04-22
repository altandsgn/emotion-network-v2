'use client';

import { useState, useEffect } from 'react';
import { Footprint } from '@/app/types/footprint';

const emotionColors = {
  anger: '#FF073A',    // Neon Red
  disgust: '#66FF00',  // Neon Green
  fear: '#B967FF',     // Neon Purple
  happiness: '#FFFF00', // Neon Yellow
  sadness: '#0099FF',  // Neon Blue
  surprise: '#FF6EC7'  // Neon Pink
} as const;

export default function AdminArchive() {
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('/api/admin/submissions?status=approved');
        const data = await response.json();
        
        if (response.ok) {
          setFootprints(data.submissions);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 font-mono">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-green-500 font-mono text-3xl mb-8">Archive</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {footprints.map((footprint) => (
            <div key={footprint.id} className="group relative">
              <div className="bg-black/20 border border-green-500/30 rounded p-4 font-mono min-h-[180px] flex flex-col transition-all duration-200 group-hover:border-green-500/50 group-hover:bg-black/30">
                <div className="text-green-500 text-sm mb-4">
                  ID: <span className="text-green-500/60">{footprint.id || 'anonymous'}</span>
                </div>
                <p className="text-green-500 mb-auto">{footprint.message}</p>
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

        {footprints.length === 0 && (
          <div className="text-center py-16">
            <span className="text-green-500/60 font-mono">No submissions found...</span>
          </div>
        )}
      </div>
    </main>
  );
} 