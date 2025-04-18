import { Outlet } from "react-router-dom"; 
import Footer from "../Footer";
import Navbar from "../Navbar";

const TeacherDashBoard = () => {
  return (
    (<div className="min-h-screen flex flex-col w-full">
      <Navbar />
      <main className="flex-1   ">
        <Outlet /> 
      </main>
      {/* <Footer /> */}
    </div>)
  );
};

export default TeacherDashBoard;
