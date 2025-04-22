import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';

const Answerevaluate = () => {
  const location = useLocation();
  const { examId, studentId } = location.state;

  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnswers = async () => {
    try {
      const res = await axios.get(`${Basic_URL}teacher/${examId}/student/${studentId}/answers`, { withCredentials: true });

      const evaluated = res.data.data.map((ans) => {
        if (
          ans.questionId?.questionType === "MCQ" &&
          ans.selectedOption !== null &&
          ans.selectedOption === ans.questionId.correctOptions
        ) {
          return { ...ans, marksObtained: ans.questionId.marks || 0, evaluated: true };
        }
        return ans;
      });

      setAnswers(evaluated);
    } catch (err) {
      console.error("Failed to fetch answers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarksChange = (index, value) => {
    const updated = [...answers];
    updated[index].marksObtained = value;
    setAnswers(updated);
  };

  const handleEvaluate = async (answerId, marks, index) => {
    const ans = answers[index];

    let finalMarks = marks;
    if (
      ans.questionId?.questionType === "MCQ" &&
      (ans.selectedOption === null || ans.selectedOption !== ans.questionId.correctOptions)
    ) {
      finalMarks = 0;
    }

    try {
      await axios.post(`${Basic_URL}teacher/answer/${answerId}/evaluate`, {
        marksObtained: finalMarks,
        evaluated: true
      }, { withCredentials: true });

      const updated = [...answers];
      updated[index].evaluated = true;
      updated[index].marksObtained = finalMarks;
      setAnswers(updated);
    } catch (err) {
      console.error("Evaluation failed:", err);
    }
  };

  const handleResetSingle = async (answerId, index) => {
    try {
      await axios.post(`${Basic_URL}teacher/answer/${answerId}/reset`, {}, { withCredentials: true });
      const updated = [...answers];
      updated[index].evaluated = false;
      updated[index].marksObtained = 0;
      setAnswers(updated);
    } catch (err) {
      console.error("Reset failed:", err);
    }
  };

  const handleResetAll = async () => {
    try {
      await axios.post(`${Basic_URL}teacher/${examId}/student/${studentId}/reset-evaluation`, {}, { withCredentials: true });
      const updated = answers.map((a) => ({ ...a, evaluated: false, marksObtained: 0 }));
      setAnswers(updated);
    } catch (err) {
      console.error("Failed to reset all evaluations:", err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Evaluate Answers</h1>

      {answers.length !== 0 && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleResetAll}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded"
          >
            Reset Whole Evaluation
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-300">Loading answers...</p>
      ) : answers.length === 0 ? (
        <p className="text-center text-red-400">No answers found for this student.</p>
      ) : (
        <div className="space-y-6">
          {answers.map((ans, index) => (
            <div key={ans._id} className="bg-green-900 text-white p-4 rounded-lg shadow-md border border-gray-600">
              <p className="mb-2 font-semibold text-yellow-300">Question: {ans.questionId?.questionText}</p>

              {ans.questionId?.options?.length > 0 && (
                <div className="mb-2">
                  <p className="font-semibold">Options:</p>
                  <ul className="list-disc pl-5 text-white">
                    {ans.questionId.options.map((opt, i) => (
                      <li key={i} className="text-white">
                        {opt.format === "Text" ? opt.text : <img src={opt.image} alt={`Option ${i}`} className="w-32" />}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {ans.questionId?.questionType === "MCQ" && (
                <p className="mb-2 text-red-300">
                  <span className="font-semibold">Correct Option:</span> {ans.questionId.correctOptions}
                </p>
              )}

              {ans.answerText && (
                <p className="mb-2 text-blue-300">
                  <span className="font-semibold">Answer:</span> {ans.answerText}
                </p>
              )}

              {ans.selectedOption !== null && (
                <p className="mb-2 text-orange-300">
                  <span className="font-semibold">Selected Option:</span> {ans.selectedOption}
                </p>
              )}

              {ans.evaluated ? (
                <div className="flex items-center gap-4">
                  <p className="text-green-400 font-semibold">Evaluated: {ans.marksObtained} marks</p>
                  <button
                    onClick={() => handleResetSingle(ans._id, index)}
                    className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-white text-sm"
                  >
                    Reset Evaluation
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={0}
                    value={ans.marksObtained}
                    onChange={(e) => handleMarksChange(index, Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded text-white bg-gray-800"
                  />
                  <button
                    onClick={() => handleEvaluate(ans._id, ans.marksObtained, index)}
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
                  >
                    Evaluate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Answerevaluate;
