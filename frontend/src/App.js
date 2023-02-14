import {  useContext } from 'react'
import LoginForm from './components/LoginForm'
import { SignOut } from './components/SignOut';
import { SignUp } from './components/SignUp'
import { StudentDashboard } from './components/StudentDashboard';
import { UserContext } from "./providers/UserProvider";


const App = () => {
  const [user, setUser] = useContext(UserContext)


  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm setUser={setUser} />
        <SignUp  />
      </div>
    )
  }

  return (
    <div>
      <StudentDashboard />
    </div>
  )
}

export default App