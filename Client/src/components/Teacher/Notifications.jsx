import React from 'react'
import { useLocation } from 'react-router-dom'

const Notifications = () => {
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

        </div>
    )
}

export default Notifications
