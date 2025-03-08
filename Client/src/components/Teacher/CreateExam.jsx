import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateExam = () => {
  const [examDetails, setExamDetails] = useState(() => {
    const savedExamDetails = JSON.parse(localStorage.getItem("examDetails"));
    return savedExamDetails || {
      department: "",
      semester: "",
      examName: "",
      startTime: "",
      duration: "",
      subjectName: "",
      totalMarks: "",
      passingMarks: "",
      aboutExam: "",
    };
  });

  const [errors, setErrors] = useState({});
  const [showNextButton, setShowNextButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("examDetails", JSON.stringify(examDetails));
  }, [examDetails]);

  useEffect(() => {
    if (sessionStorage.getItem("visitedInsertQuestions")) {
      setShowNextButton(true);
    }
  }, []);

  // Convert date to input-compatible format (YYYY-MM-DDTHH:MM)
  const convertToInputFormat = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Compatible with datetime-local input
  };

  // Convert to Indian format (DD-MM-YYYY, HH:MM AM/PM)
  const convertToIndianFormat = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "startTime") {
      newValue = new Date(value).toISOString(); // Convert back to ISO before storing
    }

    setExamDetails((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = () => {
    const newErrors = {};
    Object.keys(examDetails).forEach((key) => {
      if (!examDetails[key] && key !== "passingMarks" && key !== "aboutExam") {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    sessionStorage.setItem("visitedInsertQuestions", "true");
    navigate("/teacherDashboard/insert-questions", { state: { examDetails } });
  };

  const handleReset = () => {
    setExamDetails({
      department: "",
      semester: "",
      examName: "",
      startTime: "",
      duration: "",
      subjectName: "",
      totalMarks: "",
      passingMarks: "",
      aboutExam: "",
    });
    setErrors({});
    setShowNextButton(false);
    sessionStorage.removeItem("visitedInsertQuestions");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Exam</h1>
        <form>
          {Object.keys(examDetails).map((key) => (
            <div key={key} className="mb-4">
              <label className="block text-lg font-medium text-gray-700 mb-1">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())}
                {key !== "passingMarks" && key !== "aboutExam" && (
                  <span className="text-red-500"> *</span>
                )}
              </label>
              <input
                type={
                  key === "startTime"
                    ? "datetime-local"
                    : key === "duration" || key === "totalMarks" || key === "passingMarks" || key === "semester"
                    ? "number"
                    : "text"
                }
                name={key}
                value={key === "startTime" ? convertToInputFormat(examDetails[key]) : examDetails[key]}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  errors[key] ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200`}
              />
              {key === "startTime" && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected Date & Time (Indian Format): <strong>{convertToIndianFormat(examDetails[key])}</strong>
                </p>
              )}
              {errors[key] && <p className="text-red-500 text-sm mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Reset
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Insert Questions
            </button>

            {showNextButton && (
              <button
                type="button"
                onClick={() => navigate("/teacherDashboard/insert-questions", { state: { examDetails } })}
                className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-all"
              >
                Next →
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExam;
