import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VIDEO_URLS } from '../utils/videos'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleStart = async () => {
    setLoading(true);
    try {
      const cache = await caches.open('videos');
      await Promise.all(VIDEO_URLS.map(async (url) => {
        try {
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${url}`);
          await cache.put(url, response.clone());
        } catch (error) {
          console.error('Caching failed for:', url, error);
          throw error;
        }
      }));
      
      navigate('/player');
    } catch (error) {
      console.error('Caching failed:', error);
      alert('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-[8rem] rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400 cursor-pointer"
      >
        {loading ? 'Loading...' : 'Start'}
      </button>
    </div>
  )
}