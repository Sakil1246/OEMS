import { useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const TermsCondition = () => {
    const [accepted, setAccepted] = useState(false);
    const navigate=useNavigate();
    const location=useLocation();
    const exam=location.state;
     //console.log(exam);
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
            <div className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full text-center border border-gray-200">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">📜 Terms & Conditions</h2>
                <p className="text-gray-600 text-base mb-4 leading-relaxed">
                    Please read our terms carefully before proceeding. By continuing, you agree to abide by our guidelines.
                </p>

                {/* Terms Content */}
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-300 text-sm text-gray-700 text-left max-h-72 overflow-y-auto space-y-2">
                    <p>1. You must follow all the rules of the exam.</p>
                    <p>2. Ensure that you have a stable internet connection.</p>
                    <p>3. Don't switch between tabs or applications, as it will lead to auto-submission.</p>
                    <p>4. The exam will be automatically submitted when the timer runs out.</p>
                    <p>5. You can attempt the exam only once unless notified otherwise by the examiner.</p>
                    <p>6. In case of technical issues, inform the invigilator immediately.</p>
                </div>

                {/* Accept Checkbox */}
                <div className="mt-6 flex items-center gap-3 justify-center">
                    <input
                        type="checkbox"
                        id="agree"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                        className="w-5 h-5 text-gray-50 cursor-pointer accent-gray-50"
                    />
                    <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer">
                        I have read and agree to the Terms & Conditions.
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-6 justify-center">
                    <button
                        className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-semibold transition-all 
                            ${accepted ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
                        disabled={!accepted}
                        onClick={()=>navigate("/timer",{state:exam})}
                    >
                        <FaCheckCircle /> Accept & Continue
                    </button>

                    <button
                        className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                            onClick={()=>navigate(-1)}
                    >
                        <FaTimesCircle /> Decline
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsCondition;
