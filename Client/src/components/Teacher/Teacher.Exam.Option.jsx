import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TeacherExamOption = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0F0F24] min-h-screen flex flex-col justify-center items-center px-4 py-10 space-y-12">
        
      <motion.div
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate("/teacherDashboard/create-exam")}
        className="cursor-pointer bg-gradient-to-br from-[#1e1e2f] to-[#282842] shadow-2xl rounded-3xl p-8 w-full max-w-4xl border border-gray-600 hover:shadow-[#4c4cffda] transition-all duration-300"
      >
        <h3 className="text-3xl font-bold text-white mb-3">Create Exam</h3>
        <p className="text-gray-300 text-lg font-normal">
          Effortlessly design custom exams for your students, set questions, timings, and get them ready to roll in minutes.
        </p>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        onClick={() => navigate("/teacherDashboard/edit-exam")}
        className="cursor-pointer bg-gradient-to-br from-[#1e1e2f] to-[#282842] shadow-2xl rounded-3xl p-8 w-full max-w-4xl border border-gray-600 hover:shadow-[#4c4cff] transition-all duration-300"
      >
        <h3 className="text-3xl font-bold text-white mb-3">Edit Exam</h3>
        <p className="text-gray-300 text-lg font-normal">
          Manage your existing exams, modify questions, adjust settings, or remove outdated tests — all in one place.
        </p>
      </motion.div>

    </div>
  );
};

export default TeacherExamOption;
