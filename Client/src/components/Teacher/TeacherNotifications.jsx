import React from 'react'
import { FaBell } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'

const TeacherNotifications = () => {
    const location = useLocation();
    const { messageList } = location.state;
    const card = ({icon,Sender,type }) => {
        <div className="cursor-pointer bg-gray-800 shadow-xl rounded-2xl p-6 flex justify-between items-start w-full max-w-5xl hover:scale-[1.03] transition-transform duration-300 border border-gray-700">
        <div>
            {icon}
        </div>
        <div>
            <h1>{Sender}</h1>
            <h2>{type}</h2>
            
        </div>
        </div>
    }
    return (
        <div>
            <div className='min-h-screen px-6 flex flex-col items-center justify-center'>
                <h1 className='text-blue-500 text-2xl font-bold'>Notifications</h1>
                <div className='flex flex-col gap-4 mt-6'>
                    {messageList.map((message) => (
                        <card 
                        type="doubt"
                        icon={<FaBell size={26} />}
                        sender={message.studentId}
                        />
                        
                    ))}
            </div>
        </div>
        </div>
    )
}

export default TeacherNotifications
