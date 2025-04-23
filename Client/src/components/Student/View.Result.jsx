import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';

const ViewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examName, subjectName, score, evaluated } = location.state;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchResultDetails = async () => {
    try {
      const res = await axios.get(`${Basic_URL}exam/${examId}/result-details`, {
        withCredentials: true
      });
      setResult(res.data.data);
    } catch (err) {
      console.error("Error fetching result details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResultDetails();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button className="mb-4 text-blue-400 underline" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>
      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-4">{examName}</h2>
        <p className="text-center text-lg text-orange-300 mb-6">{subjectName}</p>
        <div className="text-center text-xl mb-6">
          <span className="font-bold text-green-400">Score:</span> {score}
        </div>
        <div className="text-center text-sm mb-4">
          Status: {evaluated ? <span className="text-green-500">Evaluated</span> : <span className="text-yellow-400">Pending Evaluation</span>}
        </div>

        {loading ? (
          <p className="text-center">Loading result details...</p>
        ) : result?.answers?.length > 0 ? (
          <div className="space-y-4">
            {result.answers.map((ans, idx) => (
              <div key={idx} className="bg-gray-700 p-4 rounded">
                <p className="font-semibold text-yellow-300">Question: {ans.questionId?.questionText}</p>
                {ans.questionId?.questionImage && (
                  <img src={ans.questionId.questionImage} alt="Question" className="w-60 mt-2 rounded" />
                )}
                {ans.questionId?.questionType === 'MCQ' && (
                  <>
                    <p className="text-blue-300 mt-2">Selected Option: {ans.selectedOption}</p>
                    <p className="text-green-300">Correct Option: {ans.questionId.correctOptions}</p>
                  </>
                )}
                {ans.subjectiveAnswer && (
                  <p className="text-purple-300 mt-2">Written Answer: {ans.subjectiveAnswer}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-red-400">No detailed answers available.</p>
        )}
      </div>
    </div>
  );
};

export default ViewResult;
