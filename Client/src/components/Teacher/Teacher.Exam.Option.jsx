import React from 'react'
import { useNavigate } from 'react-router-dom'

const TeacherExamOption = () => {
    const navigate=useNavigate();
    return (
        <div className='bg-[#0F0F24] min-h-screen justify-center flex'>

            <div className="cursor-pointer bg-[#aeaec70a] mt-8 h-40 flexm flex-col shadow-lg rounded-2xl p-6  justify-between  w-full max-w-5xl hover:scale-105 transition-all duration-300 border border-gray-300 " onClick={()=>navigate("/teacherDashboard/create-exam")}>
                    <h3 className="text-2xl font-semibold text-gray-50 mt-4">Create Exam</h3>
                    <p className="text-gray-300 text-lg font-medium mt-2">
                        Create a exam for your student 
                    </p>
            </div>
        </div>
    )
}

export default TeacherExamOption
