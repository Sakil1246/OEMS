import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse } from "date-fns";

const CreateExam = () => {
  const navigate = useNavigate();

  // Initialize state with localStorage data
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
  const [showNextButton, setShowNextButton] = useState(
    sessionStorage.getItem("visitedInsertQuestions") ? true : false
  );
  const [showInsertQuestion, setShowInsertQuestion] = useState(
    sessionStorage.getItem("visitedInsertQuestions")? false : true  
  );

  
  useEffect(() => {
    localStorage.setItem("examDetails", JSON.stringify(examDetails));
  }, [examDetails]);

  const handleChange = (name, value) => {
    let newValue = value;

    if (name === "startTime" && value) {
      if (value instanceof Date && !isNaN(value)) {
        newValue = format(value, "dd/MM/yyyy, hh:mm a");
      } else if (typeof value === "string") {
        const parsedDate = parse(value, "dd/MM/yyyy, hh:mm a", new Date());
        if (!isNaN(parsedDate)) {
          newValue = format(parsedDate, "dd/MM/yyyy, hh:mm a");
        } else {
          console.error("Invalid manual date input:", value);
          return;
        }
      }
    }

    setExamDetails((prev) => ({
      ...prev,
      [name]: newValue,
    }));

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
    localStorage.setItem("examDetails", JSON.stringify(examDetails));
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
    setShowInsertQuestion(true);
    sessionStorage.removeItem("visitedInsertQuestions");
    localStorage.removeItem("examDetails");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="bg-gray-100 shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Exam</h1>
        <form>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="department"
              value={examDetails.department}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="semester"
              value={examDetails.semester}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.semester && <p className="text-red-500 text-sm">{errors.semester}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Exam Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="examName"
              value={examDetails.examName}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.examName && <p className="text-red-500 text-sm">{errors.examName}</p>}
          </div>


          {/* Start Time Picker */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
      selected={examDetails.startTime ? parse(examDetails.startTime, "dd/MM/yyyy, hh:mm a", new Date()) : null}
      onChange={(date) => handleChange("startTime", date)}
      showTimeSelect
      timeFormat="hh:mm aa"
      timeIntervals={15}
      dateFormat="dd/MM/yyyy, hh:mm a"
      className="w-full p-3 rounded-lg border placeholder:text-white border-gray-300 text-white bg-black focus:ring-2 focus:ring-blue-500 outline-none"
      placeholderText="Select Date & Time"
    />
            {errors.startTime && <p className="text-red-500 text-sm">{errors.startTime}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={examDetails.duration}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.duration && <p className="text-red-500 text-sm">{errors.duration}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Subject Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subjectName"
              value={examDetails.subjectName}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.subjectName && <p className="text-red-500 text-sm">{errors.subjectName}</p>}
          </div>


          {/* Total Marks Input */}
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalMarks"
              value={examDetails.totalMarks}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.totalMarks && <p className="text-red-500 text-sm">{errors.totalMarks}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Passing Marks(optional)
            </label>
            <input
              type="number"
              name="passingMarks"
              value={examDetails.passingMarks}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              About Exam(optional)
            </label>
            <textarea
              name="aboutExam"
              value={examDetails.aboutExam}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>


          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Reset
            </button>

           {showInsertQuestion &&( <button
              type="button"
              onClick={handleNext}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all"
            >
              Insert Questions
            </button>)}

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
