import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Basic_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { removeAdmin } from "../utils/adminSlice";
import { removeStudent } from "../utils/studentSlice";
import { removeTeacher } from "../utils/teacherSlice";
import { useState } from "react";

const Navbar = () => {
  const admin = useSelector((store) => store.admin);
  const student = useSelector((store) => store.student);
  const teacher = useSelector((store) => store.teacher);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  let role = admin || student || teacher;
  let status = admin ? "admin" : student ? "student" : teacher ? "teacher" : "";

  const handleLogout = async () => {
    try {
      await axios.post(`${Basic_URL}${status}/logout`, {}, { withCredentials: true });
      if (admin) dispatch(removeAdmin());
      else if (student) dispatch(removeStudent());
      else if (teacher) dispatch(removeTeacher());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <Link to={`/${status}dashboard`} className="text-2xl text-orange-400 font-bold tracking-wide hover:text-orange-500 transition">
        ExamZen
      </Link>

      {/* Right Menu */}
      <div className="flex items-center gap-4">
        {/* Welcome */}
        <p className="text-white font-semibold hidden sm:block truncate max-w-xs">
          Welcome, {role?.firstName}
        </p>

        {/* Profile Dropdown */}
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="w-10 h-10 rounded-full overflow-hidden cursor-pointer border-2 border-gray-500 hover:border-orange-400 transition"
          >
            <img
              alt="Avatar"
              src="https://avatars.githubusercontent.com/u/1?v=4"
              className="w-full h-full object-cover"
            />
          </div>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-md z-50">
              <li>
                <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</a>
              </li>
              <li>
                <a className="block px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</a>
              </li>
              <li>
                <a
                  onClick={handleLogout}
                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
                >
                  Logout
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
