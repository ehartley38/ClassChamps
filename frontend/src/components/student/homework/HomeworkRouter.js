import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import { PlayBingo } from "./PlayBingo"

export const HomeworkRouter = ({  }) => {
    const location = useLocation()
    const assignment = location.state.assignment

    if (assignment.quizId.quizType === 'Bingo') return (
        <PlayBingo assignment={assignment} />
    )

    return (
        <>
        Quiz type not found
        </> 
    )

}