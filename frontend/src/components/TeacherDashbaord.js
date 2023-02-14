import { NavLink } from "react-router-dom"
import { SignOut } from "./SignOut"

export const TeacherDashboard = ({ userDetails }) => {

    return (
        <div>
            <h1>TeacherDashboard</h1>
            <h3> Welcome {userDetails.username} </h3>

            <button>
                <NavLink to='classrooms'>Classrooms</NavLink>
            </button>

            <SignOut />
        </div>
    )
}