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

  // useEffect(() => {
  //   // Fetch upcoming exams
  //   axios.get("/api/teacher/upcoming-exams")
  //     .then((res) => setUpcomingExams(res.data))
  //     .catch((err) => console.error(err));

  //   // Fetch student performance data
  //   axios.get("/api/teacher/student-performance")
  //     .then((res) => setStudentPerformance(res.data))
  //     .catch((err) => console.error(err));

  //   // Fetch notifications/announcements
  //   axios.get("/api/teacher/notifications")
  //     .then((res) => setNotifications(res.data))
  //     .catch((err) => console.error(err));
  // }, []);

  const Card = ({ title, description, icon, onClick, color }) => (
    <div 
      onClick={onClick} 
      className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-all duration-300 border border-gray-200"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mt-4">{title}</h3>
      <p className="text-gray-500 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* <Navbar /> Uncomment if needed */}
      <div className="flex flex-grow">
        {/* <Sidebar role="teacher" /> Uncomment if needed */}
        <main className="flex-grow p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Teacher Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto">
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
              onClick={() => navigate("/teacherDashboard/create-exam")}
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
      {/* <Footer /> Uncomment if needed */}
    </div>
  );
};

export default TeacherBody;
