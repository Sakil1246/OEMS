import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";

const StartExam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, examId, duration, examName, subjectName } = location.state;
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

  const handleAnswerChange = (questionId, optionIndex) => {
    setAnswers((prev) => {

      if (prev[questionId] === optionIndex) {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      } else {
        return { ...prev, [questionId]: optionIndex };
      }
    });
  };


  const handleSaveAndNext = () => {
    const questionId = newQuestions[currentQuestionIndex]._id;
    setAnsweredQuestions((prev) => new Set([...prev, questionId]));
    setReviewedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    setCurrentQuestionIndex((prev) =>
      prev === newQuestions.length - 1 ? 0 : prev + 1
    );
  };

  const handleReviewAndNext = () => {
    const questionId = newQuestions[currentQuestionIndex]._id;
    setReviewedQuestions((prev) => new Set([...prev, questionId]));
    setCurrentQuestionIndex((prev) =>
      prev === newQuestions.length - 1 ? 0 : prev + 1
    );
  };


  const handleSubmitExam = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((questionId) => {
        const question = newQuestions.find(q => String(q._id) === String(questionId));
        const isMCQ = question?.questionType === "MCQ";

        return {
          questionId,
          answerText: isMCQ ? null : answers[questionId],
          selectedOption: isMCQ ? answers[questionId] + 1 : null,
        };
      });

      console.log("Formatted Answers:", formattedAnswers);

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
    <div className="min-h-screen flex bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-3/4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {examName + ", " + subjectName}
          </h2>
          <span className="text-red-500 font-semibold">
            Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </span>
        </div>

        {newQuestions?.length > 0 && (
          <div className="mt-4">
            <p className="text-lg text-gray-900 font-semibold">
              {`Q${currentQuestionIndex + 1}: ${newQuestions[currentQuestionIndex].questionText}`}
            </p>

            <div className="flex justify-between mt-1 text-sm text-gray-600">
              <span>Bloom's Level: {newQuestions[currentQuestionIndex].bloomLevel}</span>
              <span>Marks: {newQuestions[currentQuestionIndex].marks}</span>
            </div>

            {newQuestions[currentQuestionIndex].questionImage && (
              <img
                src={newQuestions[currentQuestionIndex].questionImage}
                alt="Question"
                className="my-4 max-w-full"
              />
            )}

            {newQuestions[currentQuestionIndex].questionType === "MCQ" ? (
              <div className="mt-2">
                {newQuestions[currentQuestionIndex].options.map((option, index) => {
                  const questionId = newQuestions[currentQuestionIndex]._id;
                  const isSelected = answers[questionId] === index;

                  return (
                    <div
                      key={index}
                      onClick={() =>
                        setAnswers((prev) => ({
                          ...prev,
                          [questionId]: isSelected ? null : index,
                        }))
                      }
                      className={`cursor-pointer p-3 border rounded-lg flex items-center space-x-4 mt-4 transition
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-100'}
      `}
                    >
                      {/* Custom Radio Indicator */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
        ${isSelected ? 'border-blue-600' : 'border-gray-400'}
      `}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                      </div>

                      {/* Option Content */}
                      {option.image ? (
                        <img
                          src={option.image}
                          alt={`Option ${index + 1}`}
                          className="max-h-24 object-contain rounded"
                        />
                      ) : (
                        <span className="text-gray-800 font-medium">{option.text}</span>
                      )}
                    </div>
                  );
                })}

              </div>
            ) : (
              <textarea
                className="w-full mt-4 p-2 border rounded"
                placeholder="Type your answer..."
                value={answers[newQuestions[currentQuestionIndex]._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(newQuestions[currentQuestionIndex]._id, e.target.value)
                }
              />
            )}
          </div>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded font-medium transition ${currentQuestionIndex === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-500 text-white hover:bg-gray-600"
              }`}
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

        {currentQuestionIndex === newQuestions?.length - 1 && (
          <button
            onClick={handleSubmitExam}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Exam
          </button>
        )}
      </div>

      <div className="w-1/4 ml-4 p-4 bg-white shadow-lg rounded-lg h-full overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Questions</h3>
        <div className="grid grid-cols-4 gap-2">
          {newQuestions?.map((_, index) => {
            const questionId = newQuestions[index]._id;
            let buttonColor = "bg-gray-300 text-black";

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
                className={`w-10 h-10 rounded-full font-semibold ${buttonColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StartExam;
