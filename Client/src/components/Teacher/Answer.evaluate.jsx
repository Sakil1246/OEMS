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
      setAnswers(res.data.data);
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
    try {
      await axios.post(`${Basic_URL}teacher/answer/${answerId}/evaluate`, {
        marksObtained: marks,
        evaluated: true
      }, { withCredentials: true });

      const updated = [...answers];
      updated[index].evaluated = true;
      setAnswers(updated);
    } catch (err) {
      console.error("Evaluation failed:", err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-white">Evaluate Answers</h1>

      {loading ? (
        <p className="text-center text-gray-300">Loading answers...</p>
      ) : answers.length === 0 ? (
        <p className="text-center text-red-400">No answers found for this student.</p>
      ) : (
        <div className="space-y-6">
          {answers.map((ans, index) => (
            <div key={ans._id} className="bg-green-900 text-white p-4 rounded-lg shadow-md border border-gray-600">
              <p className="mb-2"><span className="font-semibold">Question ID:</span> {ans.questionId}</p>
              <p className="mb-2"><span className="font-semibold">Answer:</span> {ans.answerText || 'No Answer Submitted'}</p>

              {ans.evaluated ? (
                <p className="text-green-400 font-semibold">Evaluated: {ans.marksObtained} marks</p>
              ) : (
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min={0}
                    value={ans.marksObtained}
                    onChange={(e) => handleMarksChange(index, Number(e.target.value))}
                    className="w-24 px-2 py-1 rounded text-black"
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
