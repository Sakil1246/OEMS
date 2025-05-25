import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Basic_URL } from '../../utils/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { parse, format } from 'date-fns';
import DatePicker from 'react-datepicker';

const Editexampaper = () => {
  const location = useLocation();
  const id = location.state;
  const [exam, setExam] = useState(null);
  const [showInsertQuestion, setShowInsertQuestion] = useState(true);
  const [showNextButton, setShowNextButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 const navigate = useNavigate();

  const createEmptyQuestion = (questionType = "Subjective") => ({
    questionType,
    questionFormat: "Text",
    questionText: "",
    questionImage: "",
    bloomLevel: "",
    marks: 5,
    options: questionType !== "Subjective" ?
      Array(4).fill(null).map(() => ({ text: "", image: "", format: "Text" }))
      : [],
    correctOptions: questionType !== "Subjective" ? "" : undefined,
  });



  const loadSavedQuestions = () => {
    try {
      const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
      return savedQuestions.length ? savedQuestions : Array(5).fill(null).map(() => createEmptyQuestion("Subjective"));
    } catch (error) {
      console.error("Error loading saved questions:", error);
      return Array(5).fill(null).map(() => createEmptyQuestion("Subjective"));
    }
  };
  const [questions, setQuestions] = useState([]);


  const fetchExam = async () => {
    try {
      const getExam = await axios.get(Basic_URL + 'teacher/exam/' + id, { withCredentials: true });
      const data = getExam?.data.data;
      setExam(data);

      setExamDetails({
        department: data.department || '',
        semester: data.semester || '',
        examName: data.examName || '',
        startTime: data.startTime || '',
        duration: data.duration || '',
        subjectName: data.subjectName || '',
        totalMarks: data.totalMarks || '',
        passingMarks: data.passingMarks || '',
        aboutExam: data.aboutExam || '',
      });
    } catch (error) {
      console.error('Failed to fetch exam:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`${Basic_URL}teacher/fetchquestions/${id}`, {
        withCredentials: true,
      });
      //console.log(res.data.data.questions);
      const formattedQuestions = res.data.data.questions.map(q => ({
        ...q,
        options: q.options || [
          { text: "", image: "", format: "Text" },
          { text: "", image: "", format: "Text" },
          { text: "", image: "", format: "Text" },
          { text: "", image: "", format: "Text" }
        ],
        correctOptions: q.correctOptions || "",
        questionText: q.questionText || "",
        questionType: q.questionType || "MCQ",
        questionFormat: q.questionFormat || "Text",
        bloomLevel: q.bloomLevel || "Remember",
        marks: q.marks || 1,
      }));

      setQuestions(formattedQuestions);
      localStorage.setItem("questions", JSON.stringify(formattedQuestions));
    } catch (error) {
      console.error("Failed to fetch question, loading from localStorage instead:", error);
      setQuestions(loadSavedQuestions());
    }
  };


  useEffect(() => {
    fetchExam();
    fetchQuestions();
  }, []);

  //console.log(exam);
  //console.log(questions);

  const [examDetails, setExamDetails] = useState({
    department: '',
    semester: '',
    examName: '',
    startTime: '',
    duration: '',
    subjectName: '',
    totalMarks: '',
    passingMarks: '',
    aboutExam: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem('examDetails', JSON.stringify(examDetails));
  }, [examDetails]);

  const handleChange = (name, value) => {
    let newValue = value;

    if (name === 'startTime' && value) {
      if (value instanceof Date && !isNaN(value)) {
        newValue = format(value, 'dd/MM/yyyy, hh:mm a');
      } else if (typeof value === 'string') {
        const parsedDate = parse(value, 'dd/MM/yyyy, hh:mm a', new Date());
        if (!isNaN(parsedDate)) {
          newValue = format(parsedDate, 'dd/MM/yyyy, hh:mm a');
        } else {
          console.error('Invalid manual date input:', value);
          return;
        }
      }
    }

    setExamDetails((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleReset = () => {
    setExamDetails({
      department: '',
      semester: '',
      examName: '',
      startTime: '',
      duration: '',
      subjectName: '',
      totalMarks: '',
      passingMarks: '',
      aboutExam: '',
    });
    setErrors({});
    setShowNextButton(false);
    setShowInsertQuestion(true);
    sessionStorage.removeItem('visitedInsertQuestions');
    localStorage.removeItem('examDetails');
  };






  const [selectedFiles, setSelectedFiles] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    localStorage.setItem("questions", JSON.stringify(questions));
  }, [questions]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
      ...(field === "questionType" && value !== "Subjective"
        ? { options: Array(4).fill(null).map(() => ({ text: "", image: "", format: "Text" })), correctOptions: "" }
        : value === "Subjective"
          ? { options: [], correctOptions: undefined }
          : {}),
    };
    setQuestions(updatedQuestions);
  };


  const handleOptionChange = (qIndex, optIndex, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleFileSelect = (file, qIndex, field, optIndex = null) => {
    if (!file) return;
    const fileKey = `${qIndex}-${optIndex !== null ? `opt-${optIndex}` : "q"}`;

    setSelectedFiles((prev) => ({
      ...prev,
      [fileKey]: { file, preview: URL.createObjectURL(file) },
    }));
  };

  const removeFile = (qIndex, optIndex = null) => {
    const fileKey = `${qIndex}-${optIndex !== null ? `opt-${optIndex}` : "q"}`;
    setSelectedFiles((prev) => {
      const newFiles = { ...prev };
      delete newFiles[fileKey];
      return newFiles;
    });
  };

  const handleFileUpload = async (qIndex, field, optIndex = null) => {
    const fileKey = `${qIndex}-${optIndex !== null ? `opt-${optIndex}` : "q"}`;
    const file = selectedFiles[fileKey]?.file;

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(Basic_URL + "upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = response.data.imageUrl;
      const updatedQuestions = [...questions];

      if (optIndex !== null) {
        updatedQuestions[qIndex].options[optIndex][field] = imageUrl;
      } else {
        updatedQuestions[qIndex][field] = imageUrl;
      }

      setQuestions(updatedQuestions);
      setUploadStatus((prev) => ({ ...prev, [fileKey]: "Upload successful" }));
      removeFile(qIndex, optIndex);
    } catch (error) {
      setUploadStatus((prev) => ({ ...prev, [fileKey]: "Upload failed" }));
      console.error("File upload failed:", error);
    }
  };

  
  const handleSave = async () => {
  setErrorMessage(""); 

  try {
    const requiredFields = ['department', 'semester', 'examName', 'startTime', 'duration', 'subjectName', 'totalMarks'];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!examDetails[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fileUploadPromises = Object.keys(selectedFiles).map(async (fileKey) => {
      const [qIndexStr, part] = fileKey.split("-");
      const qIndex = parseInt(qIndexStr, 10);
      const optIndex = part?.startsWith("opt") ? parseInt(part.split("opt-")[1], 10) : null;
      const field = "image"; 

      await handleFileUpload(qIndex, field, optIndex);
    });

    await Promise.all(fileUploadPromises);

    await axios.post(`${Basic_URL}teacher/updateexam/${id}`, examDetails, {
      withCredentials: true,
    });

    await axios.post(`${Basic_URL}teacher/updatequestions/${id}`, {
      questions,
    }, {
      withCredentials: true,
    });

    alert("Exam and questions saved successfully!");

    localStorage.removeItem("questions");
    localStorage.removeItem("examDetails");
    navigate(-1);

  } catch (error) {
    console.error("Error saving exam and questions:", error);
    setErrorMessage("Failed to save exam. Please try again.");
  }
};



const handleAddQuestion = () => {
  const newQuestion = createEmptyQuestion("Subjective"); 
  setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0F24] p-6">
      <div className="bg-white/100 shadow-lg rounded-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Exam</h1>
        <form className='bg-red-50'>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Department <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="department"
              value={examDetails.department}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full bg-[#0F0F24] text-slate-100 text-lg p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.examName && <p className="text-red-500 text-sm">{errors.examName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={
                examDetails.startTime
                  ? parse(examDetails.startTime, 'dd/MM/yyyy, hh:mm a', new Date())
                  : null
              }
              onChange={(date) => handleChange('startTime', date)}
              showTimeSelect
              timeFormat="hh:mm aa"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy, hh:mm a"
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border placeholder:text-white border-gray-300   focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
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
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.subjectName && <p className="text-red-500 text-sm">{errors.subjectName}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalMarks"
              value={examDetails.totalMarks}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {errors.totalMarks && <p className="text-red-500 text-sm">{errors.totalMarks}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">
              Passing Marks (optional)
            </label>
            <input
              type="number"
              name="passingMarks"
              value={examDetails.passingMarks}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium text-gray-700 mb-1">About Exam (optional)</label>
            <textarea
              name="aboutExam"
              value={examDetails.aboutExam}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className="w-full p-3 bg-[#0F0F24] text-slate-100 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="mb-6 border p-4 rounded-lg bg-green-50">
              <label className="block text-lg font-medium text-gray-800 mb-1">Question {qIndex + 1}</label>

              <label className="block  font-medium text-gray-500 mb-1">Question Type</label>
              <select
                value={q.questionType}
                onChange={(e) => handleQuestionChange(qIndex, "questionType", e.target.value)}
                className="w-full border p-2 rounded text-white"
              >
                <option value="MCQ">MCQ</option>
                <option value="MSQ">MSQ</option>
                <option value="Subjective">Subjective</option>
              </select>


              <label className="block mt-2 font-medium text-gray-500 mb-1">Question Format</label>
              <select
                value={q.questionFormat}
                onChange={(e) => handleQuestionChange(qIndex, "questionFormat", e.target.value)}
                className="w-full border p-2 rounded text-white"
              >
                <option value="Text">Text</option>
                <option value="Image">Image</option>
              </select>


              <label className="block text-lg font-medium text-gray-500 mt-4">Enter Question</label>
              <input
                type="text"
                value={q.questionText}
                onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
                className="w-full border p-2 rounded text-white"
              />


              {q.questionFormat === "Image" && (
                <>

                  <input
                    type="file"
                    onChange={(e) => handleFileSelect(e.target.files[0], qIndex, "questionImage")}
                    className="mt-2 text-white"
                  />
                  {q.questionImage && (<img
                    src={q.questionImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-2"
                  />)}
                  {selectedFiles[`${qIndex}-q`] && (
                    <div className="mt-2">
                      <img
                        src={selectedFiles[`${qIndex}-q`].preview}
                        alt="Preview"
                        className="w-32 h-32 object-cover"
                      />
                      <button onClick={() => removeFile(qIndex)} className="ml-2 bg-red-500 text-white px-3 py-1 rounded">
                        Remove
                      </button>
                      <button
                        onClick={() => handleFileUpload(qIndex, "questionImage")}
                        className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Upload
                      </button>

                    </div>
                  )}
                  {uploadStatus[`${qIndex}-q`] && (
                    <p className={`mt-1 text-sm ${uploadStatus[`${qIndex}-q`] === "Upload successful" ? "text-green-600" : "text-red-600"}`}>
                      {uploadStatus[`${qIndex}-q`]}
                    </p>
                  )}
                </>
              )}


              {q.questionType !== "Subjective" &&
                q.options.map((opt, optIndex) => (
                  <div key={optIndex} className="block mt-2 font-medium text-gray-500 mb-1">
                    <label>Option {optIndex + 1} Format</label>
                    <select
                      value={opt.format}
                      onChange={(e) => handleOptionChange(qIndex, optIndex, "format", e.target.value)}
                      className="w-full border p-2 rounded text-white"
                    >
                      <option value="Text">Text</option>
                      <option value="Image">Image</option>
                    </select>

                    {opt.format === "Text" ? (
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(qIndex, optIndex, "text", e.target.value)}
                        className="w-full border p-2 rounded mt-2 text-white"
                      />
                    ) : (
                      <>
                        <input
                          type="file"
                          onChange={(e) => handleFileSelect(e.target.files[0], qIndex, "image", optIndex)}
                          className="mt-2 text-white"
                        />
                        {opt.image && (<img
                          src={opt.Image}
                          alt="Preview"
                          className="w-32 h-32 object-cover mt-2"
                        />)}
                        {selectedFiles[`${qIndex}-opt-${optIndex}`] && (
                          <div className="mt-2">
                            <img
                              src={selectedFiles[`${qIndex}-opt-${optIndex}`].preview}
                              alt="Preview"
                              className="w-32 h-32 object-cover"
                            />
                            <button
                              onClick={() => removeFile(qIndex, optIndex)}
                              className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
                            >
                              Remove
                            </button>
                            <button
                              onClick={() => handleFileUpload(qIndex, "image", optIndex)}
                              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
                            >
                              Upload
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}

              {q.questionType !== "Subjective" && (
                <>
                  <label className="block mt-5 font-medium text-gray-500 mb-1">Correct Options</label>
                  <input
                    type="text"
                    value={q.correctOptions}
                    onChange={(e) => handleQuestionChange(qIndex, "correctOptions", e.target.value)}
                    className="w-full border p-2 rounded text-white"
                  />
                </>
              )}

              <label className="block mt-2 font-medium text-gray-500 mb-1">Bloom's Level</label>
              <select className="w-full border p-3 rounded text-white"
                value={q.bloomLevel}
                onChange={(e) => handleQuestionChange(qIndex, "bloomLevel", e.target.value)}
              >
                <option>Select bloom's level</option>
                <option>Remember</option>
                <option >Understand</option>
                <option>Apply</option>
                <option>Analyze</option>
                <option>Evaluate</option>
                <option>Create</option>
              </select>

              <label className="block mt-2 font-medium text-gray-500 mb-1">Marks</label>
              <input
                type="number"
                value={q.marks}
                onChange={(e) => handleQuestionChange(qIndex, "marks", e.target.value)}
                className="w-full border p-2 rounded text-white"
              />
            </div>
          ))}
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}


          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={handleReset}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all"
            >
              Reset
            </button>


            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
              >
                Add More
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
              Save
            </button>


          </div>
        </form>
      </div>
    </div>
  );
};

export default Editexampaper;
