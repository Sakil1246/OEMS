import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaChalkboardTeacher, FaCalendarAlt, FaChartLine, FaBell } from "react-icons/fa";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Basic_URL } from "../../utils/constants";
import { db } from '../../utils/firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
const TeacherBody = () => {
  const [examId,setExamId] = useState(null);
  const teacherId = useSelector((store) => store.teacher._id);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
const [messageList, setMessageList] = useState([]);
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  };
//   const fetchExamList = async () => {
//     try {
//         const examlist = await axios.get(`${Basic_URL}teacher/${teacherId}/examlist`, { withCredentials: true });
//         setExamId(examlist.data.data[0]._id);
//     } catch (err) {
//         console.error("Failed to fetch exam list:", err);
//     } 
// };

// useEffect(() => {
//     fetchExamList();
// }, []);
// console.log(examId);

useEffect(() => {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMessageList(messages.filter((message) => message.flag === 0 && message.teacherId === teacherId));
    //console.log("Messages:", messages);
    
  });

  return () => unsubscribe();
}, []);
console.log(messageList);
const Card = ({ title, icon, color, description, onClick, index }) => (
  <motion.div
    variants={cardVariant}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.6, delay: index * 0.2 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="relative cursor-pointer bg-gradient-to-br from-[#1c1c2c] to-[#2a2a3c] shadow-lg rounded-2xl p-6 flex flex-col items-center border border-gray-600 hover:shadow-[#4c4cff] transition-all duration-300"
  >
    {title === "Notifications" && messageList.length > 0 && (
      <span className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold rounded-full px-6 py-4 shadow-md">
        {messageList.length}
      </span>
    )}
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
          {/* <Card
            title="Upcoming Exams"
            description={`${upcomingExams.length} exam(s) scheduled`}
            icon={<FaCalendarAlt size={26} />}
            color="bg-orange-500"
            index={0}
          /> */}
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
            description="See the students perfomance in the exams that you have created"
            icon={<FaChartLine size={26} />}
            onClick={() => navigate("/teacherDashboard/studentPerformance")}
            color="bg-green-500"
            index={2}
          />
          <Card
            title="Notifications"
            description={`${messageList?.length} new notification(s)`}
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
