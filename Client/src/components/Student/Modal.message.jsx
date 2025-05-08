import React, { useState } from 'react';
import { db } from '../../utils/firebase';
import { useSelector } from 'react-redux';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
const Modalmessage = ({ onClose,examId,teacherId }) => {
    const {_id}=useSelector((store)=>store.student)
    const [message, setMessage] = useState('');  
    const [type, setType] = useState('');
    const flag=0;
    const handleSend=async()=>{
        try {
            const payload = {
                content: message,
                examId:examId,
                studentId: _id,
                teacherId:teacherId,
                flag:flag,
                createdAt: Timestamp.now(),
                type:type,
              };   
              await addDoc(collection(db, "messages"), payload);
              
            alert("Message sent successfully!");
            setMessage('');
            onClose();
          } catch (err) {
            console.error("Error saving message:", err);
          }
    }
    return (
        <div className='fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center'>
            <div className='w-11/12  max-w-xl bg-slate-200 text-black p-6 rounded-lg shadow-lg relative'>
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2  text-2xl font-bold text-red-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                    </svg>
                </button>
                <h1 className="text-lg font-semibold mb-4">Leave message/doubts to your instructor</h1>
                <label className="text-sm font-semibold mb-2">Message Type:</label>
                <select className='w-full h-10 bg-gray-800 text-white p-2 rounded-lg mb-4' onChange={(e)=>setType(e.target.value)} value={type}>
                    <option value="query">Select</option>
                    <option value="doubt">Doubt</option>
                    <option value="message">Message</option>
                    <option value="feedback">Feedback</option>
                </select>
                <textarea
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    className='w-full h-40 bg-gray-800 text-white p-2 rounded-lg mb-4'
                    placeholder='Type your message here...'
                />
                <button className='bg-blue-500 text-white py-2 px-4 rounded' onClick={handleSend}>Send Message</button>
            </div>
        </div>
    );
};

export default Modalmessage;
