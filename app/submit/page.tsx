'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TypewriterText from '../components/TypewriterText';
import PixelCursor from '../components/PixelCursor';
import PixelDot from '../components/PixelDot';
import LivePreview from '../components/LivePreview';
import Navbar from '../components/Navbar';

interface FormData {
  id: string;
  message: string;
  emotion: keyof typeof emotionColors | null;
  location: string;
}

const emotionColors = {
  anger: '#FF073A',    // Neon Red
  disgust: '#66FF00',  // Neon Green
  fear: '#B967FF',     // Neon Purple
  happiness: '#FFFF00', // Neon Yellow
  sadness: '#0099FF',  // Neon Blue
  surprise: '#FF6EC7'  // Neon Pink
} as const;

export default function Submit() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    id: '',
    message: '',
    emotion: null,
    location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const maxCharacters = 128;
  const maxNameCharacters = 32;
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit footprint');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Navbar currentPath="/submit" />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 cursor-none">
          <div className="text-green-500 font-mono text-center max-w-lg">
            <TypewriterText
              text="It's out there now. Floating gently. Someone may find it, feel it, and know they're not alone."
              delay={50}
              className="text-lg mb-8"
            />
            <button
              onClick={() => router.push('/')}
              className="border border-green-500 px-6 py-3 rounded hover:bg-green-500/10 transition-colors cursor-none"
            >
              go back to the Collective Space
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar currentPath="/submit" />
      <main className="min-h-screen flex flex-col items-center p-4 pt-24 pb-[64px] cursor-none">
        <PixelCursor />
        
        <div className="w-full max-w-[500px] flex flex-col items-center">
          <h1 className="text-green-500 font-mono text-3xl mb-2 text-center">
            Leave Your Footprint
          </h1>
          <p className="text-green-500/80 font-mono text-sm mb-8 text-center">
            Write it. Whisper it. Let it exist in the collective space
          </p>

          <div className="w-full">
            <div className="mb-8">
              <div className="flex items-center gap-6">
                <h2 className="text-green-500 font-mono">Live Preview:</h2>
                <LivePreview
                  id={formData.id}
                  message={formData.message}
                  emotion={formData.emotion}
                  emotionColor={formData.emotion ? emotionColors[formData.emotion] : ''}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-green-500 font-mono text-sm mb-2">
                  ID: <span className="opacity-60">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => {
                    const newId = e.target.value;
                    if (newId.length <= maxNameCharacters) {
                      setFormData(prev => ({ ...prev, id: newId }));
                    }
                  }}
                  maxLength={maxNameCharacters}
                  className="w-full bg-black/50 border border-green-500 rounded px-3 py-3 text-green-500 font-mono focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-green-500/40"
                  placeholder="Enter Name (optional)"
                />
              </div>

              <div>
                <textarea
                  value={formData.message}
                  onChange={(e) => {
                    const newMessage = e.target.value;
                    if (newMessage.length <= maxCharacters) {
                      setFormData(prev => ({ ...prev, message: newMessage }));
                    }
                  }}
                  maxLength={maxCharacters}
                  rows={4}
                  className="w-full bg-black/50 border border-green-500 rounded px-3 py-3 text-green-500 font-mono focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-green-500/40"
                  placeholder="Type your message here..."
                />
                <div className="flex justify-end mt-2">
                  <span className="text-green-500/40 text-sm font-mono">
                    {formData.message.length}/{maxCharacters} characters
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-green-500 font-mono mb-4">Choose Emotion</h3>
                <div className="flex flex-wrap gap-x-8 gap-y-2 max-w-[500px]">
                  {Object.entries(emotionColors).map(([emotion, color]) => (
                    <button
                      key={emotion}
                      type="button"
                      onClick={() => setFormData(prev => ({ 
                        ...prev, 
                        emotion: emotion as keyof typeof emotionColors 
                      }))}
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                        formData.emotion === emotion ? 'bg-black/20' : ''
                      }`}
                    >
                      <div className="relative">
                        <svg width="32" height="32" viewBox="0 0 32 32" className="transition-transform duration-200">
                          <circle
                            cx="16"
                            cy="16"
                            r="12"
                            fill={color}
                            fillOpacity={formData.emotion === emotion ? "0.4" : "0.2"}
                            className="transition-all duration-200"
                          />
                          <path 
                            d="M14 4h4v2h-4zM10 6h4v2h-4zM18 6h4v2h-4zM8 8h2v2H8zM22 8h2v2h-2zM6 10h2v4H6zM24 10h2v4h-2zM4 14h2v4H4zM26 14h2v4h-2zM6 18h2v4H6zM24 18h2v4h-2zM8 22h2v2H8zM22 22h2v2h-2zM10 24h4v2h-4zM18 24h4v2h-4zM14 26h4v2h-4z"
                            fill={color}
                            fillOpacity={formData.emotion === emotion ? "0.9" : "0.6"}
                            className="transition-all duration-200"
                          />
                        </svg>
                        {formData.emotion === emotion && (
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

              <div>
                <label className="block text-green-500 font-mono mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-black/50 border border-green-500 rounded px-3 py-3 text-green-500 font-mono focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-green-500/40"
                  placeholder="Where are you?"
                />
              </div>

              {error && (
                <p className="text-red-500 font-mono text-sm">
                  {error}
                </p>
              )}

              <div className="flex justify-center mt-8">
                <button
                  type="submit"
                  disabled={!formData.message || !formData.emotion || !formData.location || isSubmitting}
                  className={`
                    border border-green-500 rounded px-8 py-3
                    text-green-500 font-mono
                    transition-all duration-200
                    hover:bg-green-500/10 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)]
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${isSubmitting ? 'animate-pulse' : ''}
                  `}
                >
                  {isSubmitting ? 'Releasing...' : 'Release to the Collective'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}