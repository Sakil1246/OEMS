import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';
import { useNavigate } from 'react-router-dom';

const Studentsperfomance = () => {
    const teacherId = useSelector((store) => store.teacher._id);
    const [exam, setExam] = useState([]);
    const [submissionCounts, setSubmissionCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCountSubmit = async (examId) => {
        try {
            const res = await axios.get(`${Basic_URL}teacher/${examId}/answers/count`, { withCredentials: true });
            const count = res?.data.data;
            setSubmissionCounts(prev => ({
                ...prev,
                [examId]: count
            }));
        } catch (err) {
            console.error(`Failed to fetch submission count for exam ${examId}:`, err);
        }
    };

    const fetchExamList = async () => {
        try {
            setLoading(true);
            const examlist = await axios.get(`${Basic_URL}teacher/${teacherId}/examlist`, { withCredentials: true });
            const exams = examlist.data.data;
            setExam(exams);
            await Promise.all(exams.map(examItem => fetchCountSubmit(examItem._id)));
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

    const Card = ({ title, onClick, date, marks, createdAt, department, semester, submissionCount }) => (
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
                <p className="text-yellow-300 text-lg font-medium mt-2">
                    {"Number of student attempted: " + submissionCount}
                </p>
            </div>
            <div>
                <div className='flex justify-end'>
                    <p className="text-white font-semibold px-4 py-2 mt-4 rounded-lg">
                        {"Created At: " + formatDateToIST(createdAt)}
                    </p>
                </div>
                <div className='flex justify-end'>
                    <button className="bg-blue-500 text-white font-semibold hover:bg-blue-400 px-4 py-2 mt-4 rounded-lg" onClick={onClick} >
                        View Submission
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button className='text-white mt-7 ml-7' onClick={() => navigate(-1)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
                </svg>
            </button>
            <div className='flex  justify-center items-center flex-col'>

                {loading ? (
                    <p className="text-2xl font-semibold text-white mt-8">Loading exams...</p>
                ) : exam?.length === 0 ? (
                    <h1 className='text-2xl font-bold mt-5 text-center text-red-500'>
                        No exam found
                    </h1>
                ) : (
                    <div className="flex  flex-wrap justify-center items-center gap-8 w-full mt-12 max-w-6xl">
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
                                submissionCount={submissionCounts[examItem._id] || 0}
                                onClick={() => navigate(`/teacherDashboard/teacher/exam/${examItem._id}/answers`, {
                                    state: {
                                        examId: examItem._id,
                                        examName: examItem.examName,
                                        subjectName: examItem.subjectName,
                                        marks: examItem.totalMarks
                                    }
                                })}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Studentsperfomance;
