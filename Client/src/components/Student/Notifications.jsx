import React from 'react';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 relative">
   
   <button className='absolute top-6 left-6 text-white' onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
      </button>

    
      <div className="flex flex-col items-center justify-center flex-grow ">
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
