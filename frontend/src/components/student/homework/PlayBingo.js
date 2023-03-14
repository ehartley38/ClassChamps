import { Box, Card, Container, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useAuth from "../../../providers/useAuth"
import bingoQuestionsService from '../../../services/bingoQuestions'
import bingoSessionsService from '../../../services/bingoSessions'
import { BingoAnswer } from "./BingoAnswer"

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
        //https://stackoverflow.com/questions/55824260/same-height-cards-in-material-ui

        <>
            <Container sx={{ py: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8} sx={{ my: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }} >
                            {session.questions && session.questions.map((question, index) => 
                                <BingoAnswer key={index} answer={question.answer} />
                            )}
                        </Box>

                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant='h3' sx={{ my: 2, textAlign: 'center', color: 'secondary.main' }}>
                            {assignment.assignmentName}
                        </Typography>
                        <Card sx={{ p: 1, mt: 2 }}>
                            Question
                        </Card>
                        <Card sx={{ p: 1, mt: 2 }}>
                            Hint
                        </Card>

                        <h3>Time</h3>
                    </Grid>

                </Grid>
            </Container>
        </>

    )
}