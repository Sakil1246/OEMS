import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Basic_URL } from "../../utils/constants";



const InsertQuestions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examDetails } = location.state || {};
  const [errorMessage, setErrorMessage] = useState("");
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




  const [questions, setQuestions] = useState(loadSavedQuestions());
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



  const resetForm = () => {
    setQuestions(Array(5).fill(null).map(() => createEmptyQuestion()));
    setSelectedFiles({});
    setUploadStatus({});
    localStorage.removeItem("questions");
  };

  const handleCreateExam = async () => {
    setErrorMessage("");

    try {

      // Filter out empty questions (those with blank questionText)
      const filteredQuestions = questions.filter(q => q.questionText.trim() !== "");

      if (filteredQuestions.length === 0) {
        alert("Please enter at least one valid question.");
        return;
      }

      // Validate that all MCQ/MSQ questions have a correct answer
      const invalidMCQ = filteredQuestions.some(q =>
        (q.questionType !== "Subjective" && !q.correctOptions.trim())
      );

      if (invalidMCQ) {
        alert("Please select a correct option for all MCQ/MSQ questions.");
        return;
      }

      // Prepare the final payload
      const payload = {
        semester: Number(examDetails.semester),
        examName: examDetails.examName,
        startTime: examDetails.startTime,
        duration: Number(examDetails.duration),
        subjectName: examDetails.subjectName,
        totalMarks: filteredQuestions.reduce((acc, q) => acc + Number(q.marks), 0),
        passingMarks: examDetails.passingMarks ? Number(examDetails.passingMarks) : undefined,
        aboutExam: examDetails.aboutExam ? examDetails.aboutExam : undefined,
        questions: filteredQuestions,
        department: examDetails.department,

      };

      //console.log("Submitting Exam Payload:", payload);

      const response = await axios.post(`${Basic_URL}teacher/exam/create`, payload, {
        headers: { "Content-Type": "application/json" }, withCredentials: true,
      });

      alert("Exam created successfully!");
      resetForm();
      //localStorage.removeItem(examDetails);
      navigate("/teacherDashboard");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        console.error("Error creating exam:", error.response.data.error);
        setErrorMessage(error.response.data.error);
      } else {
        console.error("Error:", error.message);
        setErrorMessage("Something went wrong. Please try again.");
      }
    }


  };



//console.log(errorMessage.error);
  return (
    <div className="min-h-screen p-8 bg-[#0F0F24]">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Insert Questions</h1>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="mb-6 border p-4 rounded-lg bg-gray-100">
            <label className="block text-lg font-medium text-gray-800 mb-1">Question {qIndex + 1}</label>

            {/* Question Type */}
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

            {/* Question Format */}
            <label className="block mt-2 font-medium text-gray-500 mb-1">Question Format</label>
            <select
              value={q.questionFormat}
              onChange={(e) => handleQuestionChange(qIndex, "questionFormat", e.target.value)}
              className="w-full border p-2 rounded text-white"
            >
              <option value="Text">Text</option>
              <option value="Image">Image</option>
            </select>

            {/* Always Visible Text Input for Question */}
            <label className="block text-lg font-medium text-gray-500 mt-4">Enter Question</label>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) => handleQuestionChange(qIndex, "questionText", e.target.value)}
              className="w-full border p-2 rounded text-white"
            />

            {/* File Upload for Image Questions */}
            {q.questionFormat === "Image" && (
              <>
                <input
                  type="file"
                  onChange={(e) => handleFileSelect(e.target.files[0], qIndex, "questionImage")}
                  className="mt-2 text-white"
                />
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

            {/* Options (for MCQ and MSQ) */}
            {q.questionType !== "Subjective" &&
              q.options.map((opt, optIndex) => (
                <div key={optIndex} className="block mt-2 font-medium text-gray-500 mb-1">
                  <label>Option {optIndex + 1} Format</label>
                  <select
                    value={opt.format}
                    onChange={(e) => handleOptionChange(qIndex, optIndex, "format", e.target.value)}
                    className="w-full border p-2 rounded"
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

        {/* Buttons */}
        <div className="flex justify-start space-x-4 mt-6">
          <button
            onClick={() => setQuestions([...questions, createEmptyQuestion("Subjective")])}
            className="bg-blue-500 text-white px-3 py-3 rounded-lg shadow hover:bg-blue-600 transition"
          >
            Add More Question
          </button>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
          >
            Back
          </button>
          <button onClick={resetForm} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition">
            Reset
          </button>
          <button onClick={handleCreateExam} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition">
            Create Exam
          </button>
        </div>
        
      </div>
    </div>
  );


};

export default InsertQuestions;
