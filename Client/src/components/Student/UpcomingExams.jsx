import { FaClipboardList } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const UpcomingExams = () => {
  const location = useLocation();
  const response = location.state;
   console.log(response);
  const navigate=useNavigate();

  if (response.length<=0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-800">
        <h1 className="text-4xl font-bold text-gray-50">No upcoming exams found.</h1>
        <button className="bg-blue-500 rounded-lg mt-6 text-gray-100 p-4"
        onClick={()=>navigate(-1)}
        >Back to Home page</button>
      </div>
    );
  }

  // Convert date to Indian format (DD-MM-YYYY, HH:MM AM/PM)
  const formatIndianDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  
  // Updated Card component
  const Card = ({ title, icon, data, color,onClick}) => (
    <div className="cursor-pointer bg-gray-800 shadow-lg rounded-2xl p-6 flex justify-between  w-full max-w-5xl hover:scale-105 transition-all duration-300 border border-gray-300 ">
     <div>
      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold text-gray-50 mt-4">{title[0]}</h3>
      {title?.length > 1 && <h3 className="text-lg text-gray-100 mt-2">{"Subject: " + title[1]}</h3>}
      <p className="text-gray-300 text-lg font-medium mt-2">
        {"Date: " + (data ? formatIndianDate(data) : "Not Available")}
      </p>
    </div>
    <div>
      <button className="bg-orange-500 text-white font-semibold px-4 py-2 mt-4 rounded-lg " onClick={onClick}>
        Start 
      </button>
    </div>
    </div>
  );

  return (
    <div className=" min-h-screen flex flex-col items-center p-6">
      <div className="flex flex-wrap justify-center gap-8 w-full max-w-6xl">
        {response?.map((exam) => (
          <Card
            key={exam._id}
            title={[exam.examName, exam.subjectName]}
            icon={<FaClipboardList />}
            data={exam.examDate}
            color="bg-blue-500"
            onClick={()=>{navigate("/termsCondition",{state:exam})}
            }
          />
        ))}
      </div>
    </div>
  );
};

export default UpcomingExams;
