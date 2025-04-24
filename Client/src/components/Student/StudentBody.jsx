import { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaPlayCircle, FaChartBar, FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";
import { useSelector } from "react-redux";
import { RiErrorWarningFill } from "react-icons/ri";
import {parse} from "date-fns"
const StudentBody = () => {
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [ongoingExams, setOngoingExams] = useState(0);
  const [progress, setProgress] = useState(null);
  const [missedExams, setMissedExams] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [exams, setExams] = useState([]);



  const Card = ({ title, icon, data, color, onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex flex-col items-center hover:scale-105 transition-all duration-300 border border-gray-200">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-50 mt-4">{title}</h3>
      <p className="text-gray-200 text-sm">{data}</p>
    </div>

  );
  const navigate = useNavigate();

  const student = useSelector((store) => store.student);
  const studentDepartment = student.department;


  const fetchExam = async () => {
    try {

      const res = await axios.get(Basic_URL + "student/exam/list", { withCredentials: true });
      setExams(res.data);
      const upexam = res.data.filter((exam) => {
        const examDate = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", new Date());
        return examDate > new Date() && exam.department === studentDepartment;
      });
      setUpcomingExams(upexam.length);

      const ongoing = res.data.filter((exam) => {
        const now = new Date();
  
        const startTime = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", new Date());
        const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", new Date());
  
        return now >= startTime && now <= endTime && exam.department === studentDepartment;
      });
      //console.log(ongoing);
      setOngoingExams(ongoing.length || 0);

      const missed = res.data.filter((exam) => {
        const now = new Date();
  
       
        const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", new Date());
        
  
        return now > endTime && exam.department === studentDepartment;
      })
      setMissedExams(missed.length || 0);
    } catch (err) {
      console.error("Failed to fetch exam details: ", err);
    }
  }

  useEffect(() => {
    fetchExam();
  }, []);

  const handleUpcoming = async () => {
    try {
      const response = exams;

      const upcoming = response.filter((exam) => {
        const examDate = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", new Date());
        return examDate > new Date() && exam.department === studentDepartment;
      });
  

      navigate("/studentdashboard/upcomingExams", { state: upcoming });
    } catch (e) {
      console.log(e)
    }
  }
  const handleOngoing = async () => {
    try {
      const response = exams;
  
      const ongoing = response.filter((exam) => {
        const now = new Date();
  
        const startTime = parse(exam.examDate, "dd/MM/yyyy, hh:mm a", new Date());
        const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", new Date());
  
        return now >= startTime && now <= endTime && exam.department === studentDepartment;
      });
  
      navigate("/studentdashboard/ongoingExams", { state: ongoing });
    } catch (e) {
      console.log(e);
    }
  };

  const handleMissed = async () => {
    try {
      const response = exams;
  
      const missed = response.filter((exam) => {
        const now = new Date();
  
       
        const endTime = parse(exam.endTime, "dd/MM/yyyy, hh:mm a", new Date());
        //console.log(endTime);
  
        return now > endTime && exam.department === studentDepartment;
      });
      //console.log(missed);
  
      navigate("/studentdashboard/missedExams", { state: missed });
    } catch (e) {
      console.log(e);
    }
  };
    return (
      <div className=" min-h-screen flex flex-col  bg-gradient-to-br from-gray-900 via-gray-800 to-black items-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 mb-0 w-full max-w-5xl">
          <Card
            title="Upcoming Exams"
            icon={<FaClipboardList size={24} />}
            data={`${upcomingExams} exams scheduled`}
            color="bg-orange-500"
            onClick={handleUpcoming}
          />
          <Card
            title="Ongoing Exams"
            icon={<FaPlayCircle size={24} />}
            data={`${ongoingExams} exams live now`}
            color="bg-blue-500"
            onClick={handleOngoing}
          />
          <Card
            title="Missed Exams"
            icon={<RiErrorWarningFill size={24} />}
            data={`${missedExams} exams you missed`}
            color="bg-red-500"
            onClick={handleMissed}
          />
          <Card
            title="Your Progress"
            icon={<FaChartBar size={24} />}
            data={`Average Score: ${progress?.averageScore || "N/A"}`}
            color="bg-green-500"
            onClick={()=>navigate("/studentdashboard/progress")}
          />
          <Card
            title="Notifications"
            description={`${notifications.length} new announcements`}
            icon={<FaBell size={24} />}
            color="bg-red-500"
            onClick={()=>navigate("/studentdashboard/notifications")}
          />

        </div>
      </div>
    );
  };

  export default StudentBody;
