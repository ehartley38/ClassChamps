import LoginForm from "./components/LoginForm";
import { SignUp } from "./components/SignUp";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { Routes, Route } from "react-router";
import { NoMatch } from "./components/NoMatch";
import { Classrooms } from "./components/teacher/classroom/Classrooms";
import { NewClassroom } from "./components/teacher/classroom/NewClassroom";
import { ClassroomView } from "./components/teacher/classroom/ClassroomView";
import { TeacherDashboard } from "./components/teacher/TeacherDashbaord";
import { StudentClassroomView } from "./components/student/classroom/StudentClassroomView";
import { Container } from "@mui/material";
import { NavBar } from "./components/NavBar";
import useAuth from "./hooks/useAuth";
import { Loading } from "./components/Loading";
import { Homework } from "./components/teacher/homework/Homework";
import { CreateHomework } from "./components/teacher/homework/CreateHomework";
import { HomeworkRouter } from "./components/student/homework/HomeworkRouter";
import "./App.css";
import { Profile } from "./components/student/Profile";
import { Badges } from "./components/student/homework/Badges";
import { Layout } from "./components/Layout";
import { Unauthorized, unauthorized } from "./components/Unauthorized";
import { RequireAuth } from "./components/RequireAuth";

const ROLES = {
  Student: 2000,
  Teacher: 3000,
};

const App = () => {
  const { user, auth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="register" element={<SignUp />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Student]} />}>
          <Route path="/">
            <Route index element={<StudentDashboard />} />
            <Route path=":roomName">
              <Route index element={<StudentClassroomView />} />
              <Route
                path="homework/:assignmentId"
                element={<HomeworkRouter />}
              />
            </Route>
            <Route path="profile">
              <Route index element={<Profile />} />
              <Route path="badges" element={<Badges />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Teacher]} />}>
          <Route path="/teacher">
            <Route index element={<TeacherDashboard />} />
            <Route path="classrooms">
              <Route index element={<Classrooms />} />
              <Route path="new" element={<NewClassroom />} />
              <Route path=":roomName" element={<ClassroomView />} />
            </Route>
            <Route path="homework">
              <Route index element={<Homework />} />
              <Route path="create" element={<CreateHomework />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );

  //   if (user) {
  //     return (
  //       <>
  //         <NavBar />
  //         <Container>
  //           <Routes>
  // <Route path="/">
  //   <Route index element={<StudentDashboard />} />
  //   <Route path=":roomName">
  //     <Route index element={<StudentClassroomView />} />
  //     <Route
  //       path="homework/:assignmentId"
  //       element={<HomeworkRouter />}
  //     />
  //   </Route>
  //   <Route path="profile">
  //     <Route index element={<Profile />} />
  //     <Route path="badges" element={<Badges />} />
  //   </Route>
  // </Route>
  // <Route path="/teacher">
  //   <Route index element={<TeacherDashboard />} />
  //   <Route path="classrooms">
  //     <Route index element={<Classrooms />} />
  //     <Route path="new" element={<NewClassroom />} />
  //     <Route path=":roomName" element={<ClassroomView />} />
  //   </Route>
  //   <Route path="homework">
  //     <Route index element={<Homework />} />
  //     <Route path="create" element={<CreateHomework />} />
  //   </Route>
  // </Route>
  //             <Route path="*" element={<NoMatch />} />
  //           </Routes>
  //         </Container>
  //       </>
  //     );
  //   }

  //   return (
  //     <Container>
  //       <Routes>
  //         <Route path="/" element={<SignUp />} />
  //         <Route path="/login" element={<LoginForm />} />
  //         <Route path="*" element={<NoMatch />} />
  //       </Routes>
  //     </Container>
  //   );
  // };
};
export default App;
