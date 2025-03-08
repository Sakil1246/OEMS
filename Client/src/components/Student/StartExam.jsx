import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const StartExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questionPaper = location.state;

  if (!questionPaper || !questionPaper.questions) {
    return <h1 className="text-center text-red-500">No Questions Found!</h1>;
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 1-hour timer

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmitExam = () => {
    alert("Exam submitted!");
    navigate("/exam-complete"); // Navigate after submission
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-3xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Exam</h2>
          <span className="text-red-500 font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}
          </span>
        </div>

        {questionPaper.questions.length > 0 && (
          <div className="mt-4">
            <p className="text-lg font-semibold">{`Q${currentQuestionIndex + 1}: ${questionPaper.questions[currentQuestionIndex].questionText}`}</p>

            {questionPaper.questions[currentQuestionIndex].questionImage && (
              <img src={questionPaper.questions[currentQuestionIndex].questionImage} alt="Question" className="my-4 max-w-full" />
            )}

            {questionPaper.questions[currentQuestionIndex].questionType === "MCQ" ? (
              <div className="mt-2">
                {questionPaper.questions[currentQuestionIndex].options.map((option, index) => (
                  <label key={index} className="block mt-2">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option}
                      onChange={() => handleAnswerChange(questionPaper.questions[currentQuestionIndex]._id, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full mt-4 p-2 border rounded"
                placeholder="Type your answer..."
                onChange={(e) => handleAnswerChange(questionPaper.questions[currentQuestionIndex]._id, e.target.value)}
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Previous
          </button>
          <button
            disabled={currentQuestionIndex === questionPaper.questions.length - 1}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>

        <button onClick={handleSubmitExam} className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit Exam
        </button>
      </div>
    </div>
  );
};

export default StartExam;
