import { Outlet } from "react-router-dom"; 
import Footer from "../Footer";
import Navbar from "../Navbar";

const TeacherDashBoard = () => {
  return (
    (<div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1 overflow-auto pt-10">
        <Outlet /> {/* This will render child components based on the route */}
      </main>
      <Footer />
    </div>)
  );
};

export default TeacherDashBoard;
