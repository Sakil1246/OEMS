import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Basic_URL } from '../../utils/constants';

const ViewResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examName, subjectName } = location.state;

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

  const renderCorrectOptions = (options) => {
    return Array.isArray(options) ? options.join(", ") : options;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button className="mb-4 text-blue-400 underline" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-white">{examName}</h2>
        <p className="text-center text-lg text-orange-300 mb-2">{subjectName}</p>

        {loading ? (
          <p className="text-center text-blue-300 text-lg mt-6">Loading result details...</p>
        ) : !result ? (
          <p className="text-center text-red-400 mt-6">Result not found.</p>
        ) : (
          <>
            <div className="text-center text-xl font-semibold mt-4 mb-4">
              <span className="text-green-400">Score:</span> {result.score ?? "N/A"}
            </div>
            <div className="text-center mb-6 text-sm">
              Status: {result.evaluated ? (
                <span className="text-green-500 font-medium">✅ Evaluated</span>
              ) : (
                <span className="text-yellow-400 font-medium">⏳ Pending</span>
              )}
            </div>

            {result.answers?.length > 0 ? (
              <div className="space-y-5">
                {result.answers.map((ans, idx) => (
                  <div key={idx} className="bg-gray-700 rounded-lg p-4 shadow-md">
                    <div className="text-yellow-300 font-medium mb-1">Q{idx + 1}: {ans.questionId?.questionText}</div>

                    {ans.questionId?.questionImage && (
                      <img
                        src={ans.questionId.questionImage}
                        alt="Question visual"
                        className="w-64 rounded-md mt-2 mb-2"
                      />
                    )}

                    {ans.questionId?.questionType === 'MCQ' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        <div className="text-blue-300">
                          Selected Option:{" "}
                          <span className="font-medium">
                            {ans.selectedOption ?? "—"}
                          </span>
                        </div>
                        <div className="text-green-300">
                          Correct Option(s):{" "}
                          <span className="font-medium">
                            {renderCorrectOptions(ans.questionId.correctOptions)}
                          </span>
                        </div>
                      </div>
                    )}

                    {ans.subjectiveAnswer && (
                      <p className="text-purple-300 mt-2">
                        <span className="font-medium">Written Answer:</span> {ans.subjectiveAnswer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-red-400 text-sm">No answers submitted.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewResult;
