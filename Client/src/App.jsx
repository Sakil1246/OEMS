import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./utils/appStore";

import SignIn from "./components/Login-SignUP";
import AdminDashBoard from "./components/Admin/AdminDashBoard";
import StudentDashBoard from "./components/Student/StudentDashBoard";
import TeacherDashBoard from "./components/Teacher/TeacherDashBoard";
import CreateExam from "./components/Teacher/CreateExam";
import InsertQuestions from "./components/Teacher/InsertQuestion";
import TeacherBody from "./components/Teacher/TeacherBody";
import StudentBody from "./components/Student/StudentBody";
import UpcomingExams from "./components/Student/UpcomingExams";
import TermsCondition from "./components/Student/TermsCondition";

import ExamTimer from "./components/Student/Timer";
import StartExam from "./components/Student/StartExam";
import OngoingExams from "./components/Student/OngoingExams";
import MissedExams from "./components/Student/MissedExams";
import Notifications from "./components/Student/Notifications";
import Progress from "./components/Student/Progress";
import TeacherExamOption from "./components/Teacher/Teacher.Exam.Option";
import EditExam from "./components/Teacher/Edit.Exam";
import Editexampaper from "./components/Teacher/Edit.exam.paper";


function App() {
  const teacher = useSelector((state) => state.teacher);
  const student = useSelector((state) => state.student);
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route path="/adminDashboard" element={<AdminDashBoard />} />

          
          {student &&

            <Route path="/studentdashboard" element={<StudentDashBoard />} >
              <Route index element={<StudentBody />} />
              <Route path="upcomingExams" element={<UpcomingExams />} />
              <Route path="ongoingExams" element={<OngoingExams />} />
              <Route path="missedExams" element={<MissedExams/>} />
              <Route path="progress" element={<Progress />} />
              <Route path="notifications" element={<Notifications/>} />

            </Route>


          }
          {student &&<Route path="termsCondition" element={<TermsCondition />} />}
          {student &&<Route path="timer" element={<ExamTimer />} />}
          {student &&<Route path="examStart" element={<StartExam />} />}

          
          {teacher && <Route path="/teacherDashboard" element={<TeacherDashBoard />}>

            <Route index element={<TeacherBody />} />
            <Route path="create-exam" element={<CreateExam />} />
            <Route path="insert-questions" element={<InsertQuestions />} />
            <Route path="exam-option" element={<TeacherExamOption/>}/>
            <Route path="edit-exam" element={<EditExam/>}/>
            <Route path="Editexampaper" element={<Editexampaper/>}/>
          </Route>}

          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
