import { FaClipboardList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleOff } from "lucide-react";

const MissedExams = () => {
  const location = useLocation();
  const response = location.state;
  const navigate = useNavigate();

  if (response.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6">
        <h1 className="text-4xl font-bold text-white mb-6">No Missed Exams Found</h1>
        <button
          className="bg-gradient-to-r from-red-600 to-red-400 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-all duration-300"
          onClick={() => navigate(-1)}
        >
          ⬅ Back to Dashboard
        </button>
      </div>
    );
  }

  const Card = ({ title, icon, color, date, marks, name }) => (
    <div className="bg-gray-800 border border-gray-700 shadow-2xl hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] rounded-2xl p-6 w-full max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:scale-[1.03] transition-transform duration-300">
      
      {/* Left Side Content */}
      <div className="flex-1">
        <div className={`w-14 h-14 flex items-center justify-center rounded-lg text-white ${color}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-semibold text-white mt-4">{title[0]}</h3>
        {title.length > 1 && <p className="text-gray-300 mt-1">Subject: {title[1]}</p>}
        <p className="text-gray-400 mt-1">📝 Marks: {marks}</p>
        <p className="text-gray-400 mt-1">📅 Date: {date}</p>
        <p className="text-sm text-gray-400 mt-2">👨‍🏫 Created by: <span className="text-white font-medium">{name[0]} {name[1]}</span></p>
      </div>
  
      {/* Right Side Status */}
      <div className="flex flex-col items-start md:items-end justify-between h-full gap-4">
        <div className="flex items-center space-x-2">
          <CircleOff className="text-red-500" size={18} />
          <span className="text-red-500 font-semibold text-lg">Missed</span>
        </div>
      </div>
    </div>
  );
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 flex flex-col items-center">
      <button
        className="self-start mb-6 text-blue-400 hover:text-blue-300 transition duration-300 font-medium"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>

      <p className="text-red-400 text-center font-semibold mb-8">
        You can attempt exams only before they start.
      </p>

      <div className="flex flex-col items-center space-y-6 w-full max-w-6xl">
        {response.map((exam) => (
          <Card
            key={exam._id}
            title={[exam.examName, exam.subjectName]}
            icon={<FaClipboardList />}
            color="bg-blue-500"
            date={exam.examDate}
            marks={exam.totalMarks}
            name={[exam.teacherFirstName, exam.teacherLastName]}
          />
        ))}
      </div>
    </div>
  );
};

export default MissedExams;
