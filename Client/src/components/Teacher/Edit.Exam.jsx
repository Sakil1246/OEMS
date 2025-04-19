import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';

const EditExam = () => {
    const teacherId = useSelector((store) => store.teacher._id);
    const [exam, setExam] = useState([]);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

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

    const handleDelete = async ({ id }) => {
        try {
            await axios.post(`${Basic_URL}teacher/exam/delete`, { id }, { withCredentials: true });
            setExam(prev => prev.filter(item => item._id !== id));
            setToast("Exam deleted successfully!");
        } catch (err) {
            console.log("Failed to delete the exam");
        }
    };

    const Card = ({ title, onClick, date, marks, createdAt, department, semester }) => (
        <div className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex justify-between w-full max-w-5xl hover:scale-105 transition-all duration-300 border border-gray-300">
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
                    <button className="bg-blue-500 text-white font-semibold px-4 py-2 mt-4 rounded-lg">
                        Edit
                    </button>
                    <button
                        className="bg-red-500 ml-3 text-white font-semibold px-4 py-2 mt-4 rounded-lg"
                        onClick={onClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className='flex justify-center items-center flex-col'>

            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to delete this exam?</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded"
                                onClick={() => setDeleteConfirmId(null)}
                            >
                                No
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                                onClick={() => {
                                    handleDelete({ id: deleteConfirmId });
                                    setDeleteConfirmId(null);
                                }}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {exam?.length === 0 ? (
                <h1 className='text-2xl font-bold mt-5 text-center text-red-500'>
                    You have not created any exam
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
                            onClick={() => setDeleteConfirmId(examItem._id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EditExam;
