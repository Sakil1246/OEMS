import React from 'react'
import { useNavigate } from 'react-router-dom'

const Progress = () => {
    const navigate=useNavigate();
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <h1 className="text-4xl font-bold text-orange-300">Your progress will be updated soon!!!</h1>
        <button className="bg-blue-500 rounded-lg mt-6 text-gray-100 p-4"
        onClick={()=>navigate(-1)}
        >Back to Home page</button>
      </div>
    </div>
  )
}

export default Progress
