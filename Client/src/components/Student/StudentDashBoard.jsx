import Navbar from '../Navbar';
import Footer from '../Footer';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { removeStudent } from '../../utils/studentSlice';

const StudentDashBoard = () => {
  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 bg-gray-950 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentDashBoard;
