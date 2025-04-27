import axios from "axios";
import { useEffect, useState } from "react";
import { Basic_URL, BG_Image } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addStudent } from "../utils/studentSlice";
import { addTeacher } from "../utils/teacherSlice";
import { addAdmin } from "../utils/adminSlice";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const toggleForm = () => setIsSignUp(!isSignUp);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSendOtp, setShowSendOtp] = useState(false);
  const [showVerifyOtp, setShowVerifyOtp] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const handleRollNoChange = (e) => {
    setRollNo(e.target.value);
    setShowSendOtp(!!e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setShowSendOtp(!!e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    setShowVerifyOtp(!!e.target.value);
  };

  const handleSignUp = async () => {
    try {
      if (role === "student") {
        const res = await axios.post(Basic_URL + "student/signup",
          { firstName, lastName, rollNo, password, department },
          { withCredentials: true }
        );
        dispatch(addStudent(res.data.data));
        setError("");
        return navigate("/studentDashboard");
      }
      else if (role === "teacher") {
        const res = await axios.post(Basic_URL + "teacher/signup",
          { firstName, lastName, email, password, department },
          { withCredentials: true }
        );
        dispatch(addTeacher(res.data.data));
        setError("");
        return navigate("/teacherDashboard");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  const handleSignIn = async () => {
    try {
      let response;
      if (role === "student") {
        response = await axios.post(Basic_URL + "student/login",
          { rollNo, password },
          { withCredentials: true }
        );
        dispatch(addStudent(response.data.data));
        setError("");
        return navigate("/studentDashboard");
      } else if (role === "teacher") {
        response = await axios.post(Basic_URL + "teacher/login",
          { email, password },
          { withCredentials: true }
        );
        dispatch(addTeacher(response.data.data));
        setError("");
        return navigate("/teacherDashboard");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };

  const handleSendOTP = async () => {
    try {
      if (role === "student") {
        await axios.post(Basic_URL + "student/sendEmail", { rollNo: rollNo }, { withCredentials: true });
      } else if (role === "teacher") {
        await axios.post(Basic_URL + "teacher/sendEmail", { email: email }, { withCredentials: true });
      }
      alert("An OTP has been sent to your email");
      setShowSendOtp(false);
      setShowOtpInput(true);
    } catch (e) {
      console.error(e.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (role === "student") {
        await axios.post(Basic_URL + "student/verifyOTP", { email: rollNo + "@tezu.ac.in", otp: otp }, { withCredentials: true });
      } else if (role === "teacher") {
        await axios.post(Basic_URL + "teacher/verifyOTP", { email: email, otp: otp }, { withCredentials: true });
      }
      alert("Verified");
      setShowOtpInput(false);
      setShowVerifyOtp(false);
      setIsOtpVerified(true);
      setOtp("");
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (isSignUp) {
          if ((role === "student" || role === "teacher") && !isOtpVerified) return;
          handleSignUp();
        } else {
          handleSignIn();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSignUp, role, isOtpVerified, handleSignUp, handleSignIn]);

  return (
    <div className="flex flex-col bg-[#1f1f62] items-center justify-center min-h-screen p-4 sm:p-6 bg-cover bg-center" style={{ backgroundImage: `url(${BG_Image})` }}>
      <motion.div key={isSignUp ? "signUp" : "signIn"} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }} className="bg-[#1e293b] p-6 rounded-lg shadow-lg w-full sm:w-8/12 md:w-6/12 lg:w-4/12 bg-opacity-90">
        <motion.h2 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="text-3xl sm:text-4xl font-bold mb-4 text-center text-white">
          {isSignUp ? "Sign Up" : "Sign In"}
        </motion.h2>
        <label className="block mb-2 font-semibold text-white">Select Role</label>
        <select className="w-full p-2 border rounded mb-4" value={role} onChange={(e) => { setRole(e.target.value); setShowSendOtp(false); setShowOtpInput(false); setIsOtpVerified(false); }}>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
        <AnimatePresence mode="wait">
          <motion.div key={isSignUp ? "signup-fields" : "signin-fields"} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {isSignUp && (
              <>
                <label className="label-text text-white">First Name</label>
                <input type="text" placeholder="Enter Your First Name" className="w-full p-2 border rounded mb-2" value={firstName} onChange={(e) => setfirstName(e.target.value)} />
                <label className="label-text text-white">Last Name</label>
                <input type="text" placeholder="Enter Your Last Name" className="w-full p-2 border rounded mb-2" value={lastName} onChange={(e) => setlastName(e.target.value)} />
              </>
            )}
            {isSignUp && role !== "admin" && (
              <>
                <label className="label-text text-white">Department</label>
                <input type="text" placeholder="Enter Your Department" className="w-full p-2 border rounded mb-2" value={department} onChange={(e) => setDepartment(e.target.value)} />
              </>
            )}
            {role === "student" && (
              <>
                <label className="label-text text-white">Roll No</label>
                <input type="text" placeholder="ex: csb22018" className="w-full p-2 border rounded mb-2 uppercase" value={rollNo} onChange={handleRollNoChange} />
              </>
            )}
            {role === "teacher" && (
              <>
                <label className="label-text text-white">Email</label>
                <input type="email" placeholder="EX: sakil@gmail.com" className="w-full p-2 border rounded mb-2" value={email} onChange={handleEmailChange} />
              </>
            )}
            {isSignUp && showSendOtp && (
              <div className="flex justify-end">
                <button className="bg-blue-500 hover:bg-blue-600 rounded-md text-white mb-3 px-4 py-2" onClick={handleSendOTP}>
                  Send OTP
                </button>
              </div>
            )}
            {isSignUp && showOtpInput && (
              <input type="text" placeholder="Enter OTP" className="w-full p-2 border rounded mb-2" value={otp} onChange={handleOtpChange} />
            )}
            {showVerifyOtp && (
              <div className="flex justify-end">
                <button className="bg-blue-500 hover:bg-blue-600 rounded-md text-white mb-3 px-4 py-2" onClick={handleVerifyOTP}>
                  Verify OTP
                </button>
              </div>
            )}
            <label className="label-text text-white">{isSignUp ? "Create a Password" : "Enter Your Password"}</label>
            <input type="password" placeholder="EX: sakil123" className="w-full p-2 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
          </motion.div>
        </AnimatePresence>
        <p className="text-red-500 text-center">{error}</p>
        <button className={`w-full p-2 rounded mb-2 transition-colors duration-300 ${isSignUp && (role === "student" || role === "teacher") ? isOtpVerified ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-400 text-gray-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`} onClick={isSignUp ? handleSignUp : handleSignIn} disabled={isSignUp && !isOtpVerified && (role === "student" || role === "teacher")}>
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <p className="flex justify-center text-gray-200 font-serif text-xl sm:text-2xl">or</p>
        <button type="button" className="w-full p-3 my-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>
        <p className="mt-4 text-center text-white">{isSignUp ? "Already have an account? " : "New here? "}
          <span className="text-blue-500 cursor-pointer underline" onClick={toggleForm}>
            {isSignUp ? "Sign in here" : "Sign up here"}
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthForm;
