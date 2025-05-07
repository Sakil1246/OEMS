import React, { useState } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';


const Card = ({ icon, sender, type, onView }) => (
    <div className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl hover:scale-105 transition-transform duration-300 border border-gray-200 flex flex-col gap-4">
        <div className="text-red-500 text-2xl">{icon}</div>

        <div className="flex justify-between items-center w-full">
            <p className="text-gray-700 text-base capitalize">
                <span className="font-semibold text-gray-900">Type:</span> {type}
            </p>
            <h1 className="text-base font-bold text-gray-800">From: {sender}</h1>
        </div>

        <button
            onClick={onView}
            className="mt-2 self-start bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
            View Message
        </button>
    </div>
);

const TeacherNotifications = () => {
    const location = useLocation();
    const { messageList } = location.state || { messageList: [] };
    const [modalMessage, setModalMessage] = useState(null);
    const [sender, setSender] = useState(null);
    return (
        <>

            <div className={`min-h-screen px-6 py-10 flex flex-col items-center transition-all duration-300 ${modalMessage ? 'blur-sm pointer-events-none select-none' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'}`}>
                <h1 className="text-3xl font-bold text-blue-600 mb-6">Notifications</h1>
                <div className="flex flex-col gap-4 w-full items-center">
                    {messageList.length > 0 ? (
                        messageList.map((message) => (
                            <Card
                                key={message._id}
                                type={message.type || 'doubt'}
                                icon={<FaBell size={26} />}
                                sender={message.studentId}
                                onView={() => {setModalMessage(message.content);setSender(message.studentId); }}
                            />
                        ))
                    ) : (
                        <p className="text-gray-400 text-lg">No notifications to show.</p>
                    )}
                </div>
            </div>


            {modalMessage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl w-full relative">
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => setModalMessage(null)}
                        >
                            <FaTimes />
                        </button>

                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Message Content</h2>
                        <p className="text-sm text-gray-600 mb-4">From: <span className="font-semibold text-gray-800">{sender}</span></p>
                        <div className="h-52 bg-gray-700 overflow-y-auto rounded p-4">
                            <p className="text-white">{modalMessage}</p>
                        </div>

                        <div className="text-right mt-4">
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                onClick={() => alert('Reply feature coming soon!')}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeacherNotifications;
