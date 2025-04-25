import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Basic_URL } from '../../utils/constants';
import axios from 'axios';

const Answersubmittingstudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { examId, examName, subjectName, marks } = location.state;

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Basic_URL}teacher/${examId}/answers/submittingstudents`, {
        withCredentials: true
      });
      setStudents(res?.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchStudents();
      }
    };

    fetchStudents();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleEvaluateClick = (studentId) => {
    navigate("/teacherDashboard/teacher/answer/evaluate", {
      state: {
        examId,
        studentId,
        examName,
        subjectName,
        rollNo: students.find(student => student._id === studentId)?.rollNo,
      }
    });
  };
  const handleUpdateResults = async () => {
    try {
      const payload = {
        examId,
        results: students.map(student => ({
          studentId: student?._id,
          marksObtained: student?.marksObtained ,
        }))
      };

      const res = await axios.post(`${Basic_URL}teacher/update-results`, payload, {
        withCredentials: true,
      });

      alert("Results updated successfully!");
      navigate("/teacherDashboard/studentPerformance")
    } catch (error) {
      console.error("Error updating results:", error);
      alert("Failed to update results.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <button
        className="absolute  left-6 text-blue-400 hover:text-blue-300 font-medium transition"
        onClick={() => navigate(-1)}
      >
        ⬅ Back
      </button>
      <h1 className="text-3xl font-bold text-center mb-8">{examName + ", " + subjectName}</h1>

      {loading ? (
        <p className="text-center text-blue-300 text-lg">Loading submissions...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-red-400 text-lg">No submissions yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-xl shadow-md">
            <thead>
              <tr className="bg-green-700 text-white text-left">
                <th className="py-3 px-6">Roll Number</th>
                <th className="py-3 px-6">Full Name</th>
                <th className="py-3 px-6 text-center">
                  Marks Obtained
                  <span className="text-yellow-300 font-semibold">{` (Out of ${marks})`}</span>
                </th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id} className="border-b border-gray-700 hover:bg-gray-700 transition-all">
                  <td className="py-3 px-6 uppercase">{student.rollNo}</td>
                  <td className="py-3 px-6">{student.firstName} {student.lastName}</td>
                  <td className="py-3 px-6 text-center">
                    {student.evaluated ? (
                      <span className="text-green-400 font-medium">{student.marksObtained} Marks</span>
                    ) : (
                      <span className="text-yellow-400 italic">Not evaluated</span>
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleEvaluateClick(student._id)}
                      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${student.evaluated
                        ? "bg-green-600 hover:bg-green-500 text-white"
                        : "bg-blue-500 hover:bg-blue-700 text-white"
                        }`}
                    >
                      {student.evaluated ? "✅Evaluated" : "Evaluate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length > 0 && (
            <div className="text-center mt-6">
              <button
                onClick={handleUpdateResults}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md text-lg font-semibold"
              >
                Update Results
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default Answersubmittingstudents;
