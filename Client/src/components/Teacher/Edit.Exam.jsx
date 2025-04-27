import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const EditExam = () => {
    const teacherId = useSelector((store) => store.teacher._id);
    const [exam, setExam] = useState([]);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchExamList = async () => {
        try {
            const examlist = await axios.get(`${Basic_URL}teacher/${teacherId}/examlist`, { withCredentials: true });
            setExam(examlist.data.data);
        } catch (err) {
            console.error("Failed to fetch exam list:", err);
        } finally {
            setLoading(false);
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
        } catch (err) {
            console.log("Failed to delete the exam");
        }
    };

    const Card = ({ title, onEditClick, onClick, date, marks, createdAt, department, semester }) => (
        <div className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex justify-between w-full hover:scale-105 transition-all duration-300 border border-gray-300">
            <div>
                <h3 className="text-2xl font-semibold text-gray-50 mt-2">{title[0]}</h3>
                {title?.length > 1 && <h3 className="text-lg text-gray-100 mt-1">{"Subject: " + title[1]}</h3>}
                <p className="text-gray-300 text-lg font-medium mt-1">{"Marks: " + marks}</p>
                <p className="text-gray-300 text-lg font-medium mt-1">{"Exam Date: " + date}</p>
                <p className="text-gray-300 text-lg font-medium mt-1">
                    {"Department: " + department + ", " + semester +
                        (semester === 1 ? "st" : semester === 2 ? "nd" : semester === 3 ? "rd" : "th") + " sem"}
                </p>
            </div>
            <div className="flex flex-col justify-between items-end ml-4">
                <p className="text-white text-sm font-semibold mt-2">
                    {"Created At: " + formatDateToIST(createdAt)}
                </p>
                <div className="flex mt-4">
                    <button className="bg-blue-500 text-white hover:bg-blue-400 font-semibold px-4 py-2 rounded-lg" onClick={onEditClick}>
                        Edit
                    </button>
                    <button
                        className="bg-red-500 ml-3 text-white hover:bg-red-400 font-semibold px-4 py-2 rounded-lg"
                        onClick={onClick}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className='bg-gray-900 min-h-screen px-4 py-6'>

            {/* Delete Confirm Popup */}
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

            {/* Loader */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto">
                    <h1 className='text-3xl font-bold text-center text-white mb-8'>
                        The list of exams you have created
                    </h1>

                    {exam.length === 0 ? (
                        <h2 className='text-xl font-semibold text-center text-red-500'>
                            You have not created any exam
                        </h2>
                    ) : (
                        <div className="flex flex-col space-y-6">
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
                                    onEditClick={() => navigate(`/teacherDashboard/Editexampaper/${examItem._id}`, { state: examItem._id })}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EditExam;
