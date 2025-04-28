import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { VIDEO_URLS } from '../utils/videos'

export default function VideoPlayer() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [cachedUrls, setCachedUrls] = useState<string[]>([])
  const navigate = useNavigate()

  const preCacheVideo = async (idx: number) => {
    try {
      const cache = await caches.open('videos')
      const url = VIDEO_URLS[idx]
      if (!(await cache.match(url))) {
        const response = await fetch(url)
        if (response.ok) {
          await cache.put(url, response.clone())
          const blob = await response.blob()
          const objectUrl = URL.createObjectURL(blob)
          setCachedUrls(prev => {
            const newUrls = [...prev]
            newUrls[idx] = objectUrl
            return newUrls
          })
        }
      }
    } catch (error) {
      console.error('Pre-cache failed:', error)
    }
  }

  useEffect(() => {
    const loadCurrentVideo = async () => {
      try {
        const cache = await caches.open('videos')
        const currentUrl = VIDEO_URLS[currentIdx]
        
        let response = await cache.match(currentUrl)
        if (!response) {
          const fetchResponse = await fetch(currentUrl)
          if (!fetchResponse.ok) throw new Error()
          await cache.put(currentUrl, fetchResponse.clone())
          response = fetchResponse
        }

        // Create object URL
        const blob = await response.blob()
        const objectUrl = URL.createObjectURL(blob)
        setCachedUrls(prev => {
          const newUrls = [...prev]
          newUrls[currentIdx] = objectUrl
          return newUrls
        })

        const preCacheIndices = [
          (currentIdx + 4) % VIDEO_URLS.length,
          (currentIdx - 4 + VIDEO_URLS.length) % VIDEO_URLS.length,
        ]
        preCacheIndices.forEach(preCacheVideo)
      } catch (error) {
        console.error('Video load failed:', error)
        navigate(-1)
      }
    }

    loadCurrentVideo()
  }, [currentIdx, navigate])

  const handleNavigation = (delta: number) => {
    setCurrentIdx(prev => {
      const newIdx = (prev + delta + VIDEO_URLS.length) % VIDEO_URLS.length
      const preCacheIdx = (newIdx + delta * 4 + VIDEO_URLS.length) % VIDEO_URLS.length
      preCacheVideo(preCacheIdx)
      return newIdx
    })
  }

  if (!cachedUrls[currentIdx]) {
    return <div className='flex h-screen flex-col items-center justify-center'>Loading video...</div>
  }

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
          onClick={() => handleNavigation(-1)}
          className="w-[8rem] rounded bg-gray-500 px-4 py-2 text-white cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={() => handleNavigation(1)}
          className="w-[8rem] rounded bg-gray-500 px-4 py-2 text-white cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}