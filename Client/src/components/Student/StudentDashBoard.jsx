// import React from 'react'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { Outlet } from 'react-router-dom';

const StudentDashBoard = () => {
  return (
    (<div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1  bg-gray-950 overflow-auto  ">
        <Outlet /> 
      </main>
      <Footer />
    </div>)
  );
}

export default StudentDashBoard
