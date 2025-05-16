import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";
import Card from "./Card"; 
import { useSelector } from "react-redux";

const TeacherNotifications = () => {
    const notifications  = useSelector((store) => store.teacherNotification.notification);
    const [studentMap, setStudentMap] = useState({});
    const [selectedTab, setSelectedTab] = useState("unread"); 


    
    const filteredMessages =
        selectedTab === "unread"
            ? notifications?.filter((msg) => msg.flag === 0)
            : notifications?.filter((msg) => msg.flag === 1);

   
    useEffect(() => {
        const uniqueIds = [...new Set(notifications?.map((m) => m.studentId))];
        const fetchStudentInfo = async () => {
            try {
                const res = await axios.post(Basic_URL + "student/details", { ids: uniqueIds });
                setStudentMap(res.data);
            } catch (err) {
                console.error("Failed to fetch student info:", err);
            }
        };
        if (uniqueIds.length) fetchStudentInfo();
    }, [notifications]);

   
    const handleDeleteMessage = (messageId) => {
  setSelectedTab("unread"); 
};


    return (
        <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center">
            <div className="flex w-full mb-6">
                <button
                    className={`px-5 py-2 rounded-lg border-2 text-white w-1/2 font-semibold transition ${
                        selectedTab === "unread"
                            ? "bg-yellow-500 border-white"
                            : "bg-gray-700 hover:bg-yellow-600 border-gray-600"
                    }`}
                    onClick={() => setSelectedTab("unread")}
                >
                    Unread
                </button>
                <button
                    className={`px-5 py-2 rounded-lg border-2 text-white w-1/2 font-semibold transition ${
                        selectedTab === "read"
                            ? "bg-green-500  border-white"
                            : "bg-gray-700 hover:bg-green-600 border-gray-600"
                    }`}
                    onClick={() => setSelectedTab("read")}
                >
                    Read
                </button>
            </div>

      
            <div className="flex flex-col gap-4 w-full items-center">
                {filteredMessages?.length > 0 ? (
                    <>
                        <p className="text-gray-100 text-lg">
                            {selectedTab === "unread" ? "Unread messages." : "Read messages."}
                        </p>
                        {filteredMessages.map((message) => (
                            <Card
                                key={message._id}
                                messageId={message.id}
                                type={message.type || "doubt"}
                                icon={<FaBell size={26} />}
                                content={message.content}
                                studentInfo={studentMap[message.studentId]}
                                onDelete={handleDeleteMessage} 
                                flag={message.flag}
                            />
                        ))}
                    </>
                ) : (
                    <p className="text-gray-400 text-lg">
                        {selectedTab === "unread" ? "No unread messages." : "No read messages."}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TeacherNotifications;
