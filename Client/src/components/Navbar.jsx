//import React from 'react'

import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import { Basic_URL } from "../utils/constants";
import { Link, useNavigate } from "react-router-dom";
import { removeAdmin } from "../utils/adminSlice";
import { removeStudent } from "../utils/studentSlice";
import { removeTeacher } from "../utils/teacherSlice";

const Navbar = () => {
  const admin=useSelector(store=>store.admin);
  const student=useSelector(store=>store.student);
  const teacher=useSelector(store=>store.teacher);
  const navigate=useNavigate();
  const dispatch=useDispatch();
  let role = admin || student || teacher;
  let status = admin ? "admin" : student ? "student" : teacher ? "teacher" : "";
  
  if(admin) {role=admin;
    status="admin";
  }
  if(student) {role=student;
    status="student";
  }
  if(teacher) {role=teacher;
    status="teacher";
  }
  console.log(status);

  const handleLogout=async()=>{
   
    try{
      
      
     await axios.post(Basic_URL+status+"/logout",{},{withCredentials:true});
      if(role===admin) dispatch(removeAdmin());
      else if(role===student) dispatch(removeStudent());
      else if(role===teacher) dispatch(removeTeacher());
      return navigate("/");
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div>
     <div className="navbar  bg-gray-800 border-b-4 ">
  <div className="flex-1">
    <Link className="btn btn-ghost text-orange-500 text-xl bg-gray-700" to={"/"+status+"dashboard"}>ExamZen</Link>
  </div>
  <div className="flex-none gap-2">
    {/* <div className="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div> */}
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
       
        <div className="w-10 rounded-full">
          
          <img
            alt="Tailwind CSS Navbar component"
            src="data:image/png;base64,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" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-blue-500  rounded-box z-[1] mt-3 w-52 p-2 left-0 shadow">
        <li>
          <a className="justify-between text-white hover:text-black hover:bg-white">
            Profile
            {/* <span className="badge">New</span> */}
          </a>
        </li>
        <li><a className="text-white hover:text-black hover:bg-white">Settings</a></li>
        <li><a onClick={handleLogout} className="text-white hover:text-black hover:bg-white">Logout</a></li>
      </ul>
    </div>
    <p className="text-white font-bold">{"Welcome "+role?.firstName}</p>
  </div>
</div>
    </div>
  )
}

export default Navbar
