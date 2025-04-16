import { FaClipboardList } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { CircleOff } from "lucide-react";

const MissedExams = () => {
  const location = useLocation();
  const response = location.state;
  // console.log(response);
  const navigate=useNavigate();

  if (response.length<=0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <h1 className="text-4xl font-bold text-gray-50">No missed exams found.</h1>
        <button className="bg-blue-500 rounded-lg mt-6 text-gray-100 p-4"
        onClick={()=>navigate(-1)}
        >Back to Home page</button>
      </div>
    );
  }

  
  const Card = ({ title, icon, color,onClick,date,marks}) => (
    <div className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex justify-between  w-full max-w-5xl hover:scale-105 transition-all duration-300 border border-gray-300 ">
     <div>
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-50 mt-4">{title[0]}</h3>
      {title?.length > 1 && <h3 className="text-lg text-gray-100 mt-2">{"Subject: " + title[1]}</h3>}
      <p className="text-gray-300 text-lg font-medium mt-2">
          {"Marks: " + marks}
        </p>
      <p className="text-gray-300 text-lg font-medium mt-2">
        {"Date: " + date}
      </p>
    </div>
    <div>
    </div>
   
  <div className="flex items-center space-x-1">
    <CircleOff className="text-red-500" size={14} />
    <span className="text-red-500 font-semibold">Missed</span>
  </div>

    </div>
  );

  return (
    <>
     <p className="text-red-500 font-bold text-center">You can attempt the exams only before it starts.</p>
    
    <div className=" min-h-screen flex flex-col items-center p-6">
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {response?.map((exam) => (
          <Card
            key={exam._id}
            title={[exam.examName, exam.subjectName]}
            icon={<FaClipboardList />}
            color="bg-blue-500"
            date={exam.examDate}
            marks={exam.totalMarks}
            
          />
        ))}
        <button className="bg-red-500 rounded-lg mt-6 text-gray-100 p-4"
        onClick={()=>navigate(-1)}
        >Back to Home page</button>
      </div>
     
    </div>
    </>
  );
};

export default MissedExams;
