import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import VideoPlayer from './components/VideoPlayer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/player" element={<VideoPlayer />} />
      </Routes>
    </BrowserRouter>
  )
}