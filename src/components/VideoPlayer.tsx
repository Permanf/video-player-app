import { useState, useEffect } from 'react'
import { VIDEO_URLS } from '../utils/videos'

export default function VideoPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [cachedUrls, setCachedUrls] = useState<string[]>([])
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const cache = await caches.open('videos');
        const urls = await Promise.all(
          VIDEO_URLS.map(async (url) => {
            const response = await cache.match(url);
            if (!response) {
              throw new Error(`Missing cache for ${url}`);
            }
            return URL.createObjectURL(await response.blob());
          })
        );
        setCachedUrls(urls);
      } catch (error) {
        console.error('Video loading failed:', error);
        navigate(-1);
      }
    };
    
    loadVideos();
  }, []);
  const navigate = (delta: number) => 
    setCurrentIdx(prev => (prev + delta + VIDEO_URLS.length) % VIDEO_URLS.length)

  if (!cachedUrls.length) return <div className='flex h-screen flex-col items-center justify-center'>Loading videos...</div>

  return (
    <div className="flex h-screen flex-col items-center justify-center px-5 py-7">
        <div className='flex items-center justify-center h-[90%]'>
            <video
            key={currentIdx}
            src={cachedUrls[currentIdx]}
            autoPlay
            loop
            className="w-full max-w-xl h-full object-cover"
            />
        </div>
      
        <div className="h-[10%] flex gap-6 items-center">
            <button
            onClick={() => navigate(-1)}
            className="w-[8rem] rounded bg-gray-500 px-4 py-2 text-white cursor-pointer"
            >
            Previous
            </button>
            <button
            onClick={() => navigate(1)}
            className="w-[8rem] rounded bg-gray-500 px-4 py-2 text-white cursor-pointer"
            >
            Next
            </button>
        </div>
    </div>
  )
}