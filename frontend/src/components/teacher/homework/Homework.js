import { NavLink } from "react-router-dom"

export const Homework = () => {
    return (
        <div>
            <h1>Homework</h1>
            <button>
                <NavLink to='create'>Create</NavLink>
            </button>
            <h3>List of homework</h3>
        </div>
    )
}