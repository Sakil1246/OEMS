import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Studentsperfomance = () => {
    const teacherId = useSelector((store) => store.teacher._id);
    const [exam, setExam] = useState([]);
    const navigate=useNavigate();
    const fetchCountSubmit=async()=>{
        try{
            const res=await axios.get(`${Basic_URL}teacher/${examId}/answers/count`,{withCredentials:true});
        }
    }
    const fetchExamList = async () => {
        try {
            const examlist = await axios.get(`${Basic_URL}teacher/${teacherId}/examlist`, { withCredentials: true });
            setExam(examlist.data.data);
        } catch (err) {
            console.error("Failed to fetch exam list:", err);
        }
    };

    useEffect(() => {
        fetchExamList();
    }, []);

    const formatDateToIST = (utcDate) => {
        const date = new Date(utcDate);
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return date.toLocaleString('en-GB', options).replace(',', ', ');
    };

    const Card = ({ title,onEditClick, onClick, date, marks, createdAt, department, semester }) => (
        <div className="cursor-pointer bg-green-950 shadow-lg rounded-2xl p-6 flex justify-between w-full max-w-5xl hover:scale-95 transition-all duration-300 border border-gray-300">
            <div>
                <h3 className="text-2xl font-semibold text-gray-50 mt-4">{title[0]}</h3>
                {title?.length > 1 && <h3 className="text-lg text-gray-100 mt-2">{"Subject: " + title[1]}</h3>}
                <p className="text-gray-300 text-lg font-medium mt-2">{"Marks: " + marks}</p>
                <p className="text-gray-300 text-lg font-medium mt-2">{"Exam Date: " + date}</p>
                <p className="text-gray-300 text-lg font-medium mt-2">
                    {"Department: " + department + ", " + semester +
                        (semester === 1 ? "st" : semester === 2 ? "nd" : semester === 3 ? "rd" : "th") + " sem"}
                </p>

            </div>
            <div>
                <div className='flex justify-end'>
                    <p className="text-white font-semibold px-4 py-2 mt-4 rounded-lg">
                        {"Created At: " + formatDateToIST(createdAt)}
                    </p>
                </div>
                <div className='flex justify-end'>
                    <button className="bg-blue-500 text-white font-semibold hover:bg-blue-400 px-4 py-2 mt-4 rounded-lg" onClick={onEditClick}>
                       View Submissioin
                    </button>
                    
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex justify-center items-center flex-col'>
            {exam?.length === 0 ? (
                <h1 className='text-2xl font-bold mt-5 text-center text-red-500'>
                    No exam found 
                </h1>
            ) : (
                <div className="flex flex-wrap justify-center items-center gap-8 w-full mt-12 max-w-6xl">
                    <h1 className='text-2xl font-bold mt-5 text-white text-center w-full'>The list of exams you have created</h1>
                    {exam.map((examItem) => (
                        <Card
                            key={examItem._id}
                            title={[examItem.examName, examItem.subjectName]}
                            date={examItem.startTime}
                            marks={examItem.totalMarks}
                            createdAt={examItem.createdAt}
                            department={examItem.department}
                            semester={examItem.semester}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Studentsperfomance;
