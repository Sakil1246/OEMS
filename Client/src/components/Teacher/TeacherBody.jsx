import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaChalkboardTeacher, FaCalendarAlt, FaChartLine, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";

const TeacherBody = () => {
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };

  const Card = ({ title, icon, color, description, onClick, index }) => (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer bg-gradient-to-br from-[#1c1c2c] to-[#2a2a3c] shadow-lg rounded-2xl p-6 flex flex-col items-center border border-gray-600 hover:shadow-[#4c4cff] transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-50 mt-4">{title}</h3>
      <p className="text-gray-300 text-sm text-center mt-2">{description}</p>
    </motion.div>
  );

  return (
    <div className="bg-[#0F0F24] min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold text-white text-center mt-12 mb-8">📊 Teacher Dashboard</h1>
      
      <main className="flex-grow flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 mb-20 w-full max-w-6xl px-6"
        >
          <Card
            title="Upcoming Exams"
            description={`${upcomingExams.length} exam(s) scheduled`}
            icon={<FaCalendarAlt size={26} />}
            color="bg-orange-500"
            index={0}
          />
          <Card
            title="Manage Exams"
            description="Create, edit, or delete exam details"
            icon={<FaChalkboardTeacher size={26} />}
            color="bg-blue-500"
            onClick={() => navigate("/teacherDashboard/exam-option")}
            index={1}
          />
          <Card
            title="Student Performance"
            description={studentPerformance ? `Average Score: ${studentPerformance.averageScore}` : "Loading..."}
            icon={<FaChartLine size={26} />}
            color="bg-green-500"
            index={2}
          />
          <Card
            title="Notifications"
            description={`${notifications.length} new announcements`}
            icon={<FaBell size={26} />}
            color="bg-red-500"
            index={3}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherBody;
