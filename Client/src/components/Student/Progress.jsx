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
  const [attemptedExams, setAttemptedExams] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttemptedExams = async () => {
      try {
        const res = await axios.get(`${Basic_URL}student/${_id}/attempted-exams`, {
          withCredentials: true,
        });
        setAttemptedExams((res.data.data || []).filter(Boolean));

      } catch (err) {
        console.error('Error fetching attempted exams:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttemptedExams();
  }, [_id]);

console.log(attemptedExams);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <button
          className="mb-6 text-blue-400 hover:text-blue-300 transition duration-300 font-medium"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>

        {(attemptedExams!==null && attemptedExams?.length!==0 )&&(<h1 className="text-4xl font-extrabold text-center text-orange-400 mb-12">
          Your Attempted Exams
        </h1>
)}
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-400"></div>
          </div>
        ) : (attemptedExams.length === 0 || attemptedExams===null)? (
          <p className="text-center text-red-400 mt-12 text-lg font-medium">
            You haven't attempted any exams yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attemptedExams?.map((exam) => (
              <motion.div
                key={exam?._id}
                className="bg-gray-800 hover:shadow-xl transition-all border border-gray-700 rounded-2xl p-6"
                whileHover={{ scale: 1.03 }}
              >
                <h2 className="text-2xl font-bold text-blue-300 mb-1">{exam?.examName}</h2>
                <p className="text-gray-300">Subject: <span className="font-medium text-white">{exam?.subjectName}</span></p>
                <p className="text-gray-400 mb-4">Date: {exam?.startTime}</p>
                <button
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 transition-all py-2 rounded-xl text-white font-semibold"
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;
