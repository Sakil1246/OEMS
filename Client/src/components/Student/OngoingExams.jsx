import { FaClipboardList } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const OngoingExams = () => {
  const location = useLocation();
  const response = location.state || [];
  const navigate = useNavigate();

  const Card = ({ title, icon, color, date, marks, name }) => (
    <div className="cursor-pointer bg-gray-800 shadow-xl rounded-2xl p-6 flex justify-between items-start w-full max-w-5xl hover:scale-[1.03] transition-transform duration-300 border border-gray-700">
      <div>
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${color}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-white mt-4">{title[0]}</h3>
        {title?.length > 1 && (
          <h4 className="text-lg text-gray-400 mt-2">Subject: {title[1]}</h4>
        )}
        <p className="text-gray-300 text-base font-medium mt-3">
          Marks: {marks}
        </p>
        <p className="text-gray-300 text-base font-medium mt-1">
          Date: {date}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faCircle} className="text-red-500 animate-pulse" />
          <span className="text-red-500 font-bold">Live</span>
        </div>
        <p className="text-sm text-gray-400 mt-8">
          Created by: <span className="font-semibold text-gray-200">{name[0]} {name[1]}</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-6 relative">
        <button className="absolute top-6 left-6 text-white" onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
          <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z" />
        </svg>
      </button>
     
           {response.length > 0 ? (
        <>
        <p className="text-red-400 text-center font-semibold text-xl mb-10 mt-20">
        You can attempt the exams only before they start.
      </p>
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
          {response.map((exam) => (
            <Card
              key={exam._id}
              title={[exam.examName, exam.subjectName]}
              icon={<FaClipboardList size={24} />}
              color="bg-blue-500"
              date={exam.examDate}
              marks={exam.totalMarks}
              name={[exam.teacherFirstName, exam.teacherLastName]}
            />
          ))}
        </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center bg-gray-800 rounded-2xl p-10 shadow-lg w-full max-w-md mt-36">
          <h1 className="text-3xl font-bold text-white mb-4">No Ongoing Exams</h1>
          <p className="text-gray-400 text-center mb-2">Currently there are no live exams available.</p>
          <p className="text-gray-500 text-center text-sm">Please check back later!</p>
        </div>
      )
      }
    </div>
    
  );
};

export default OngoingExams;
