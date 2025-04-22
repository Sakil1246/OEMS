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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
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
        </div>
      )}
    </div>
  );
};

export default Answersubmittingstudents;
