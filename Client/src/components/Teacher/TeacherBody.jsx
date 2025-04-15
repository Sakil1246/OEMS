import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
//import Sidebar from "../Sidebar";
import { FaChalkboardTeacher, FaCalendarAlt, FaChartLine, FaBell } from "react-icons/fa";

const TeacherBody = () => {
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  
  const Card = ({ title, icon,  color, description,onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-all duration-300 border border-gray-200">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-50 mt-4">{title}</h3>
      <p className="text-gray-200 text-sm">{description}</p>
    </div>

  );

  return (
    <div className="bg-black min-h-screen flex flex-col">
      
        <h1 className="text-3xl font-bold text-white text-center  mt-9">Teacher Dashboard</h1>
        <main className="flex-grow items-center min-h-screen flex flex-col  ">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 mb-0 w-full max-w-5xl ">
            <Card 
              title="Upcoming Exams" 
              description={`${upcomingExams.length} exam(s) scheduled`} 
              icon={<FaCalendarAlt size={24} />} 
              color="bg-orange-500"
            />
            <Card 
              title="Manage Exams" 
              description="Create, edit, or delete exam details" 
              icon={<FaChalkboardTeacher size={24} />} 
              color="bg-blue-500"
              onClick={() => navigate("/teacherDashboard/exam-option")}
            />
            <Card 
              title="Student Performance" 
              description={studentPerformance ? `Average Score: ${studentPerformance.averageScore}` : "Loading..."} 
              icon={<FaChartLine size={24} />} 
              color="bg-green-500"
            />
            <Card 
              title="Notifications" 
              description={`${notifications.length} new announcements`} 
              icon={<FaBell size={24} />} 
              color="bg-red-500"
            />
          </div>
        </main>
      
    </div>
  );
};

export default TeacherBody;
