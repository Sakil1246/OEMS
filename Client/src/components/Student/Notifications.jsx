import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 relative">
   
      <button
        className="absolute top-6 left-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-blue-700 transition-all duration-300 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

    
      <div className="flex flex-col items-center justify-center flex-grow mt-20">
        <div className="bg-gray-800 rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <h1 className="text-3xl font-bold text-white mb-4">No New Notifications</h1>
          <p className="text-gray-400 mb-2">You're all caught up!</p>
          <p className="text-gray-500 text-sm">We will notify you when there's something important.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
