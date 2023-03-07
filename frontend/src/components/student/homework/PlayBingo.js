import { useEffect, useState } from "react"
import useAuth from "../../../providers/useAuth"
import bingoQuestionsService from '../../../services/bingoQuestions'
import bingoSessionsService from '../../../services/bingoSessions'


export const PlayBingo = ({ assignment }) => {
    const [session, setSession] = useState({})
    const { jwt } = useAuth()

    useEffect(() => {
        const initialize = async () => {
            // Check if session exists
            const sessions = await bingoSessionsService.getUsersSessions(jwt)

            // If not, create a new session
            if (sessions.length === 0) {
                const questionData = await bingoQuestionsService.getAllByQuiz(jwt, assignment.quizId.id)
                const questions = questionData.map(obj => {
                    return {
                        question: obj.question,
                        answer: obj.answer,
                        hint: obj.hint,
                        isCorrect: false
                    }
                })

                const newSession = {
                    assignment: assignment.id,
                    questions: questions
                }

                const savedSession = await bingoSessionsService.createSession(jwt, newSession)
                setSession(savedSession)
            } else if (sessions.length === 1) {
                // Else load the session
                setSession(sessions[0])
            } else {
                console.log('Too many sessions');
            }


        }
        initialize()

    }, [])

    return (
        <>
            {assignment.assignmentName}
            {session.questions && session.questions.map((question, i) => {
                return (
                    <div key={i}>
                        <h3>{question.question}</h3>
                        <p>{question.answer}</p>
                        <p>{question.hint}</p>
                    </div>
                )
            })}

        </>
    )
}