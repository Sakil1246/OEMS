import { FaClipboardList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const UpcomingExams = () => {
  const location = useLocation();
  const response = location.state;
  const navigate = useNavigate();

  if (!response || response.length <= 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
        <button
          className="absolute top-6 left-6 text-blue-400 hover:text-blue-300 transition font-medium"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
        <h1 className="text-4xl font-extrabold text-orange-400 mb-2">No Upcoming Exams</h1>
        <p className="text-gray-400">You're all caught up! 🎉</p>
      </div>
    );
  }

  const Card = ({ title, icon, color, onClick, date, marks }) => (
    <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-lg border border-gray-700 hover:border-orange-400 hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 flex items-center justify-center text-white rounded-lg ${color}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{title[0]}</h3>
          {title?.length > 1 && (
            <p className="text-md text-gray-300">Subject: {title[1]}</p>
          )}
          <p className="text-sm text-gray-400 mt-2">📝 Marks: {marks}</p>
          <p className="text-sm text-gray-400">📅 Date: {date}</p>
        </div>
      </div>
      <button
        className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-xl text-white font-semibold transition"
        onClick={onClick}
      >
        Start
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white relative">
      <button
        className="absolute top-6 left-6 text-blue-400 hover:text-blue-300 font-medium transition"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>
      <h1 className="text-3xl font-bold text-center text-orange-400 mb-10">Your Upcoming Exams</h1>
      <div className="flex flex-col gap-6 items-center">
        {response?.map((exam) => (
          <Card
            key={exam._id}
            title={[exam.examName, exam.subjectName]}
            icon={<FaClipboardList size={22} />}
            color="bg-blue-500"
            onClick={() => navigate("/termsCondition", { state: exam })}
            date={exam.examDate}
            marks={exam.totalMarks}
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingExams;
