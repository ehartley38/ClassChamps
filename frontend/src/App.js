import { useContext } from 'react'
import LoginForm from './components/LoginForm'
import { SignOut } from './components/SignOut';
import { SignUp } from './components/SignUp'
import { StudentDashboard } from './components/StudentDashboard';
import { UserContext } from "./providers/UserProvider";
import { Routes, Route } from "react-router";
import { NoMatch } from './components/NoMatch'
import { Classrooms } from './components/teacher/classroom/Classrooms';
import { NewClassroom } from './components/teacher/classroom/NewClassroom';
import { ClassroomView } from './components/teacher/classroom/ClassroomView';


const App = () => {
  const [user, setUser] = useContext(UserContext)

  if (user) {
    return (
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path="/classrooms">
          <Route index element={<Classrooms />} />
          <Route path="new" element={<NewClassroom />} />
          <Route path=":roomName" element={<ClassroomView />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    )
  }



  return (
    <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<LoginForm setUser={setUser}/>} />
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}

export default App