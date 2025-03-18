import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";

const StartExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, examId, duration } = location.state;
  const newQuestions = questions.questions;

  if (!questions) {
    return <h1 className="text-center text-red-500">No Questions Found!</h1>;
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); 
  const [reviewedQuestions, setReviewedQuestions] = useState(new Set()); 
  const [timeLeft, setTimeLeft] = useState(duration * 60);

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
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSaveAndNext = () => {
    const questionId = newQuestions[currentQuestionIndex]._id;
    setAnsweredQuestions((prev) => new Set([...prev, questionId])); 
    setReviewedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, newQuestions.length - 1));
  };

  const handleReviewAndNext = () => {
    const questionId = newQuestions[currentQuestionIndex]._id;
    setReviewedQuestions((prev) => new Set([...prev, questionId])); 
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, newQuestions.length - 1));
  };

  const handleSubmitExam = async () => {
    try {
     
      const formattedAnswers = Object.keys(answers).map((questionId) => {
        return {
          questionId: questionId,
          answerText: typeof answers[questionId] === "string" ? answers[questionId] : null,
          selectedOption: typeof answers[questionId] === "string" ? null : answers[questionId],
        };
      });
  
      await axios.post(`${Basic_URL}student/exam/submit/${examId}`, formattedAnswers, {
        withCredentials: true,
      });
  
      alert("Exam submitted successfully!");
      navigate("/studentdashboard");
    } catch (e) {
      console.error("Submission Error:", e);
      alert("Exam submission failed. Please try again.");
    }
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

        
        <div className="flex gap-2 mt-4">
          {newQuestions.map((_, index) => {
            const questionId = newQuestions[index]._id;
            let buttonColor = "bg-gray-200 text-black"; 
            if (index === currentQuestionIndex) {
              buttonColor = "bg-blue-500 text-white"; 
            } else if (answeredQuestions.has(questionId)) {
              buttonColor = "bg-green-500 text-white"; 
            } else if (reviewedQuestions.has(questionId)) {
              buttonColor = "bg-orange-500 text-white";
            }

            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`px-4 py-2 rounded-full ${buttonColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

       
        {newQuestions.length > 0 && (
          <div className="mt-4">
            <p className="text-lg text-gray-900 font-semibold">
              {`Q${currentQuestionIndex + 1}: ${newQuestions[currentQuestionIndex].questionText}`}
            </p>

            
            <div className="flex flex-col justify-end text-right">
              <div className="text-sm text-gray-800">
                Bloom's Level: {newQuestions[currentQuestionIndex].bloomLevel}
              </div>
              <div className="text-sm text-gray-800 ml-4">
                Marks: {newQuestions[currentQuestionIndex].marks}
              </div>
            </div>

           
            {newQuestions[currentQuestionIndex].questionImage && (
              <img
                src={newQuestions[currentQuestionIndex].questionImage}
                alt="Question Img"
                className="my-4 max-w-full"
              />
            )}

            
            {newQuestions[currentQuestionIndex].questionType === "MCQ" ? (
              <div className="mt-2">
                {newQuestions[currentQuestionIndex].options.map((option, index) => (
                  <label key={index} className="block mt-2">
                    <input
                      type="radio"
                      name={`question-${currentQuestionIndex}`}
                      value={option.text}
                      checked={answers[newQuestions[currentQuestionIndex]._id] === option.text}
                      onChange={() => handleAnswerChange(newQuestions[currentQuestionIndex]._id, option.text)}
                      className="mr-2"
                    />
                    <span className="text-black font-medium">{option.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full mt-4 p-2 border rounded"
                placeholder="Type your answer..."
                value={answers[newQuestions[currentQuestionIndex]._id] || ""}
                onChange={(e) => handleAnswerChange(newQuestions[currentQuestionIndex]._id, e.target.value)}
              />
            )}
          </div>
        )}

        
        <div className="flex justify-between mt-6">
          <button
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Previous
          </button>

          <button
            onClick={handleSaveAndNext}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save and Next
          </button>

          <button
            onClick={handleReviewAndNext}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Review and Next
          </button>
        </div>

        
        {currentQuestionIndex === newQuestions.length - 1 && (
          <button onClick={handleSubmitExam} className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Submit Exam
          </button>
        )}
      </div>
    </div>
  );
};

export default StartExam;
