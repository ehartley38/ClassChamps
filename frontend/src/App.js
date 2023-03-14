import LoginForm from './components/LoginForm'
import { SignUp } from './components/SignUp'
import { StudentDashboard } from './components/student/StudentDashboard';
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
import { Loading } from './components/Loading';
import { Homework } from './components/teacher/homework/Homework';
import { CreateHomework } from './components/teacher/homework/CreateHomework';
import { HomeworkRouter } from './components/student/homework/HomeworkRouter';
import './App.css'


const App = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <Loading />
  }

  if (user) {
    return (
      <>
        <NavBar />
        <Container>
          <Routes>
            <Route path='/'>
              <Route index element={<StudentDashboard />} />
              <Route path=":roomName" >
                <Route index element={<StudentClassroomView />} />
                <Route path="homework/:assignmentId" element={<HomeworkRouter />} />
              </Route>
            </Route>
            <Route path='/teacher'>
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