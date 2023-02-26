import { useContext } from 'react'
import LoginForm from './components/LoginForm'
import { SignOut } from './components/SignOut';
import { SignUp } from './components/SignUp'
import { StudentDashboard } from './components/student/StudentDashboard';
import { UserContext } from "./providers/UserProvider";
import { Routes, Route } from "react-router";
import { NoMatch } from './components/NoMatch'
import { Classrooms } from './components/teacher/classroom/Classrooms';
import { NewClassroom } from './components/teacher/classroom/NewClassroom';
import { ClassroomView } from './components/teacher/classroom/ClassroomView';
import { TeacherDashboard } from './components/teacher/TeacherDashbaord';
import { StudentClassroomView } from './components/student/classroom/StudentClassroomView';
import { Container } from "@mui/material"
import { NavBar } from './components/NavBar';
import useAuth from './providers/useAuth';


const App = () => {
  //const { user, jwt, loading, error } = useAuth()
  const { user } = useAuth()

  if (user) {
    return (
      <>
        <NavBar />
        <Container>
          <Routes>
            <Route path='/'>
              <Route index element={<StudentDashboard />} />
              <Route path=":roomName" element={<StudentClassroomView />} />
            </Route>
            <Route path='/teacher'>
              <Route index element={<TeacherDashboard />} />
              <Route path="classrooms">
                <Route index element={<Classrooms />} />
                <Route path="new" element={<NewClassroom />} />
                <Route path=":roomName" element={<ClassroomView />} />
              </Route>
            </Route>
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </Container>
      </>
    )
  }

  return (
    <Container>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </Container>

  )

}

export default App