import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";
import { parse } from "date-fns";

const ExamTimer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const response = location.state;

  if (!response) {
    return <h1 className="text-center text-red-500">No Exam Data Found!</h1>;
  }

  const { examId,duration,examName,subjectName} = response;
  //console.log(duration);

  const [questions, setQuestions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await axios.get(`${Basic_URL}student/exam/${examId}/questions`, {
          withCredentials: true,
        });
        setQuestions(data);
      } catch (err) {
        console.log("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [examId]);

  
  const examDate = parse(response.examDate, "dd/MM/yyyy, hh:mm a", new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeDiff = examDate - currentTime;
  const remainingTime = timeDiff > 0 ? new Date(timeDiff).toISOString().substr(11, 8) : "00:00:00";

  useEffect(() => {
    if (timeDiff <= 0) {
      navigate("/examStart", { state: { questions,examId,duration,examName,subjectName} }); 
    }
  }, [timeDiff, navigate, questions]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full text-center border border-gray-200">
        <h1 className="text-blue-600 font-bold text-xl">Exam will start In:</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-2">{remainingTime}</h2>
      </div>
    </div>
  );
};

export default ExamTimer;
