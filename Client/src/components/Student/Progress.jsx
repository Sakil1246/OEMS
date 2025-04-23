import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';

const Progress = () => {
  const student = useSelector((store) => store.student);
  const { _id } = student;
  const navigate = useNavigate();
  const [attemptedExams, setAttemptedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttemptedExams = async () => {
      try {
        const res = await axios.get(`${Basic_URL}student/${_id}/attempted-exams`, {
          withCredentials: true,
        });
        setAttemptedExams(res.data.data || []);
      } catch (err) {
        console.error('Error fetching attempted exams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptedExams();
  }, [_id]);

  return (<div className="bg-gray-900 text-white min-h-screen py-10 px-4">
    <button className="mb-4 absolute text-blue-400 underline" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
    
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-orange-400 mb-10">
          Your Exam Progress
        </h1>

        {loading ? (
          <p className="text-center text-gray-300">Loading your exams...</p>
        ) : attemptedExams.length === 0 ? (
          <p className="text-center text-red-400">You haven't attempted any exams yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attemptedExams.map((exam) => (
              <div
                key={exam._id}
                className="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700"
              >
                <h2 className="text-xl font-bold text-blue-300 mb-2">{exam.examName}</h2>
                <p className="text-gray-300">Subject: {exam.subjectName}</p>
                <p className="text-gray-400 mb-4">Date: {exam.startTime}</p>
                <button
                  className="mt-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold"
                  onClick={() =>
                    navigate('/studentdashboard/progress/view-result', {
                      state: {
                        examId: exam._id,
                        examName: exam.examName,
                        subject: exam.subjectName,
                      },
                    })
                  }
                >
                  View Result
                </button>
              </div>
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default Progress;
