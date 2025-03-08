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
     <div className="navbar bg-base-300">
  <div className="flex-1">
    <Link className="btn btn-ghost text-xl" to={"/"+status+"dashboard"}>ExamZen</Link>
  </div>
  <div className="flex-none gap-2">
    <div className="form-control">
      <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
    </div>
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <p>{"Welcome "+role?.firstName}</p>
        <div className="w-10 rounded-full">
          
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li>
        <li><a>Settings</a></li>
        <li><a onClick={handleLogout}>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
    </div>
  )
}

export default Navbar
