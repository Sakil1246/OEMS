import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
const Card = ({ icon, studentInfo, type, content, messageId }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleViewMessage = async () => {
        setIsOpen(true);


        if (messageId) {
            try {
                const messageRef = doc(db, "messages", messageId);
                await updateDoc(messageRef, { flag: 1 });
                console.log(`Flag updated for message: ${messageId}`);
            } catch (error) {
                console.error("Error updating flag:", error);
            }
        }
    };

    return (
        <>
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-5xl flex flex-col gap-4">
                <div className="text-red-500 text-2xl">{icon}</div>
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
        </>
    );
};


const TeacherNotifications = () => {
    const location = useLocation();
    const { messageList } = location.state || { messageList: [] };
    const [studentMap, setStudentMap] = useState({});

    useEffect(() => {
        const uniqueIds = [...new Set(messageList.map((m) => m.studentId))];
        const fetchStudentInfo = async () => {
            try {
                const res = await axios.post(Basic_URL + "student/details", { ids: uniqueIds });
                setStudentMap(res.data);
            } catch (err) {
                console.error("Failed to fetch student info:", err);
            }
        };
        if (uniqueIds.length) fetchStudentInfo();
    }, [messageList]);

    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Notifications</h1>
            <div className="flex flex-col gap-4 w-full items-center">
                {messageList.length > 0 ? (
                    messageList.map((message) => (
                        <Card
                            key={message._id}
                            messageId={message.id}
                            type={message.type || "doubt"}
                            icon={<FaBell size={26} />}
                            content={message.content}
                            studentInfo={studentMap[message.studentId]}
                        />

                    ))
                ) : (
                    <p className="text-gray-400 text-lg">No notifications to show.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherNotifications;
