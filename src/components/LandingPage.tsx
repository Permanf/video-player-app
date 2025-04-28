import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleStart = () => {
    navigate('/player')
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={handleStart}
        className="w-[8rem] rounded bg-blue-500 px-4 py-2 text-white disabled:bg-gray-400 cursor-pointer"
      >
        Start
      </button>
    </div>
  )
}