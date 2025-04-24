import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClipboardList,
  FaPlayCircle,
  FaChartBar,
  FaBell,
} from "react-icons/fa";
import { RiErrorWarningFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";
import { useSelector } from "react-redux";
import { parse } from "date-fns";

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

  const Card = ({ title, icon, data, color, onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 p-6 flex flex-col items-center text-white"
    >
      <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg mt-4 font-semibold text-white text-center">{title}</h3>
      <p className="text-gray-300 text-sm mt-1 text-center">{data}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex justify-center items-start">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16 w-full max-w-6xl">
        <Card
          title="Upcoming Exams"
          icon={<FaClipboardList size={24} />}
          data={`${upcomingExams} exams scheduled`}
          color="bg-orange-500"
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
          title="Your Progress"
          icon={<FaChartBar size={24} />}
          data={`Average Score: ${progress?.averageScore || "N/A"}`}
          color="bg-green-600"
          onClick={() => navigate("/studentdashboard/progress")}
        />
        <Card
          title="Notifications"
          icon={<FaBell size={24} />}
          data={`${notifications.length} new announcements`}
          color="bg-purple-600"
          onClick={() => navigate("/studentdashboard/notifications")}
        />
      </div>
    </div>
  );
};

export default StudentBody;
