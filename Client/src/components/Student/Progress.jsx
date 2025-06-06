import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';
import { motion } from 'framer-motion';

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
        //console.log(res);
        
        setAttemptedExams((res.data.data || []).filter(Boolean));
      } catch (err) {
        console.error('Error fetching attempted exams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptedExams();
  }, [_id]);
//console.log(attemptedExams);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen px-4 py-10">
      
      <button  onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
      </button>
      <div className="max-w-6xl mx-auto">
      

        {attemptedExams?.length > 0 && (
          <h1 className="text-4xl font-extrabold text-center text-white mb-12">
            Your Attempted Exams
          </h1>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
          </div>
        ) : attemptedExams?.length === 0 ? (
          <p className="text-center text-red-400 mt-12 text-lg font-medium">
            You haven't attempted any exams yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attemptedExams.map((exam) => (
              <motion.div
                key={exam._id}
                className="bg-gray-800 hover:shadow-xl transition-all border border-gray-700 rounded-2xl p-6"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-2xl font-bold text-blue-300 mb-1">{exam.examName}</h2>
                <p className="text-gray-300">
                  Subject: <span className="font-medium text-white">{exam.subjectName}</span>
                </p>
                <p className="text-gray-400 mb-2">
                  Date: {exam.startTime}
                </p>
                <p className="text-gray-300">
                  Status:{' '}
                  {exam.evaluated ? (
                    <span className="text-green-400 font-medium">✅ Evaluated</span>
                  ) : (
                    <span className="text-yellow-400 font-medium">⏳ Pending</span>
                  )}
                </p>
                {exam.evaluated && (
                  <p className="text-gray-300">
                    Score:{' '}
                    <span className="font-semibold text-white">{exam.score +"/"+exam.totalMarks}</span>
                  </p>
                )}
                <button
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 transition-all py-2 rounded-xl text-white font-semibold"
                  onClick={() =>
                    navigate('/studentdashboard/progress/view-result', {
                      state: {
                        examId: exam._id,
                        examName: exam.examName,
                        subject: exam.subjectName,
                        totalMarks: exam.totalMarks,
                        teacherId: exam.teacherId,
                      },
                    })
                  }
                >
                  View Result
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
