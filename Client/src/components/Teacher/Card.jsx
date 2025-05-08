import React, { useState } from "react";
import { FaBell, FaTimes } from "react-icons/fa";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../utils/firebase"; 

const Card = ({ icon, studentInfo, type, content, messageId, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleViewMessage = () => {
        setIsOpen(true);
    };

    const handleDeleteMessage = async () => {
        try {
            const messageRef = doc(db, "messages", messageId);
            await deleteDoc(messageRef);
            console.log(`Message ${messageId} deleted successfully`);
            onDelete(messageId);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl flex flex-col gap-4">
            <div className="flex justify-between">
            <div className="text-red-500 text-2xl">{icon}</div>
            <button
                onClick={handleDeleteMessage}
                className=" top-2 right-2  text-2xl font-bold text-red-600"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16">
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708" />
                    </svg>
            </button>
            </div>
            
            <div className="flex justify-between items-center w-full">
                <p className="text-gray-700 text-base capitalize">
                    <span className="font-semibold text-gray-900">Type:</span> {type}
                </p>
                <h1 className="text-base font-bold text-gray-800">
                    From: {studentInfo
                        ? `${studentInfo.firstName} ${studentInfo.lastName} (${studentInfo.rollNo})`
                        : "Unknown"}
                </h1>
            </div>

            <button
                onClick={handleViewMessage}
                className="mt-2 self-start bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
                View Message
            </button>

            

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-xl w-full relative">
                    <button
                                className="absolute top-4 right-4 bg-red-500 text-white px-1 py-1"
                                onClick={() => setIsOpen(false)}
                            >
                                <FaTimes />
                            </button>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Message Content</h2>
                        <p className="text-gray-500 mb-1 font-semibold">
                            From: {studentInfo
                                ? `${studentInfo.firstName} ${studentInfo.lastName} (${studentInfo.rollNo})`
                                : "Unknown"}
                        </p>
                        <div className="h-52 bg-gray-700 p-2 rounded text-white overflow-y-auto">
                            {content}
                        </div>

                        <div className="text-right">
                            <button
                                className="bg-green-500 text-white px-4 py-2 mt-3 rounded-lg hover:bg-green-600 transition"
                                onClick={() => alert("Reply feature coming soon!")}
                            >
                                Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Card;
