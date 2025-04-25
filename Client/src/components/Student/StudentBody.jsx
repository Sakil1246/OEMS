import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaPlayCircle, FaChartBar, FaBell } from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";
import { useSelector } from "react-redux";
import { parse } from "date-fns";
import { motion } from "framer-motion";

const StudentBody = () => {
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [ongoingExams, setOngoingExams] = useState(0);
  const [progress, setProgress] = useState(null);
  const [missedExams, setMissedExams] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [exams, setExams] = useState([]);

  const navigate = useNavigate();
  const student = useSelector((store) => store.student);
  const studentDepartment = student.department;

  const fetchExam = async () => {
    try {
      const res = await axios.get(Basic_URL + "student/exam/list", {
        withCredentials: true,
      });
      setExams(res.data);

      const now = new Date();

      const upcoming = res.data.filter((exam) => {
        const examDate = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", now);
        return examDate > now && exam.department === studentDepartment;
      });
      setUpcomingExams(upcoming.length);

      const ongoing = res.data.filter((exam) => {
        const startTime = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", now);
        const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", now);
        return now >= startTime && now <= endTime && exam.department === studentDepartment;
      });
      setOngoingExams(ongoing.length);

      const missed = res.data.filter((exam) => {
        const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", now);
        return now > endTime && exam.department === studentDepartment;
      });
      setMissedExams(missed.length);
    } catch (err) {
      console.error("Failed to fetch exam details: ", err);
    }
  };

  useEffect(() => {
    fetchExam();
  }, []);

  const cardVariant = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const Card = ({ title, icon, data, color, onClick, index }) => (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-gradient-to-br from-[#1c1c2c] to-[#2a2a3c] border border-gray-600 shadow-md hover:shadow-lg p-6 flex flex-col items-center text-white transition-all duration-300"
    >
      <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mt-4 text-center">{title}</h3>
      <p className="text-gray-300 text-sm mt-2 text-center">{data}</p>
    </motion.div>
  );

  return (
    <div className="bg-[#0F0F24] min-h-screen flex flex-col">
      <h1 className="text-4xl font-bold text-white text-center mt-12 mb-8">🎓 Student Dashboard</h1>

      <main className="flex-grow flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10 mb-20 w-full max-w-6xl px-6"
        >
          <Card
            title="Upcoming Exams"
            icon={<FaClipboardList size={24} />}
            data={`${upcomingExams} exams scheduled`}
            color="bg-orange-500"
            index={0}
            onClick={() => {
              const upcoming = exams.filter((exam) => {
                const examDate = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", new Date());
                return examDate > new Date() && exam.department === studentDepartment;
              });
              navigate("/studentdashboard/upcomingExams", { state: upcoming });
            }}
          />
          <Card
            title="Ongoing Exams"
            icon={<FaPlayCircle size={24} />}
            data={`${ongoingExams} exams live now`}
            color="bg-blue-500"
            index={1}
            onClick={() => {
              const ongoing = exams.filter((exam) => {
                const now = new Date();
                const startTime = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", now);
                const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", now);
                return now >= startTime && now <= endTime && exam.department === studentDepartment;
              });
              navigate("/studentdashboard/ongoingExams", { state: ongoing });
            }}
          />
          <Card
            title="Missed Exams"
            icon={<RiErrorWarningFill size={24} />}
            data={`${missedExams} exams you missed`}
            color="bg-red-500"
            index={2}
            onClick={() => {
              const missed = exams.filter((exam) => {
                const now = new Date();
                const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", now);
                return now > endTime && exam.department === studentDepartment;
              });
              navigate("/studentdashboard/missedExams", { state: missed });
            }}
          />
          <Card
            title="Progress & Attempted"
            icon={<FaChartBar size={24} />}
            data={`See how you're doing`}
            color="bg-green-600"
            index={3}
            onClick={() => navigate("/studentdashboard/progress")}
          />
          <Card
            title="Notifications"
            icon={<FaBell size={24} />}
            data={`${notifications.length} new announcements`}
            color="bg-purple-600"
            index={4}
            onClick={() => navigate("/studentdashboard/notifications")}
          />
        </motion.div>
      </main>
    </div>
  );
};
  
export default StudentBody;
