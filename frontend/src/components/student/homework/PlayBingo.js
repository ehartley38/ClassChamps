import { Box, Card, Container, Grid, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useAuth from "../../../providers/useAuth"
import bingoQuestionsService from '../../../services/bingoQuestions'
import bingoSessionsService from '../../../services/bingoSessions'
import { BingoAnswer } from "./BingoAnswer"

export const PlayBingo = ({ assignment }) => {
    const [session, setSession] = useState({})
    const [questions, setQuestions] = useState([])
    const [answerCards, setAnswerCards] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const { jwt } = useAuth()

    useEffect(() => {
        const initialize = async () => {
            // Check if session exists for this particular assignment
            const sessions = await bingoSessionsService.getUsersSessions(jwt)
            const count = sessions.filter(session => session.assignment === assignment.id).length

            // if session doesn't exist, create a new session
            if (count === 0) {
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
                setQuestions(savedSession.questions)
                setAnswerCards(shuffleArray(savedSession.questions))
            } else if (count === 1) {
                // Else load the session
                const currentSession = sessions.filter(session => session.assignment === assignment.id)[0]
                setSession(currentSession)
                setQuestions(currentSession.questions)
                setAnswerCards(shuffleArray(currentSession.questions))
            } else {
                console.log('Too many sessions');
            }
        }
        initialize()

    }, [])

    const shuffleArray = (array) => {
        const shuffledArray = [...array]
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };


    const handleAnswerClick = (questionId) => {
        if (questionId === questions[currentQuestionIndex]._id) {
            console.log('Answer correct');
        } else {
            console.log('Answer incorrect');
        }
    }

    return (
        //https://stackoverflow.com/questions/55824260/same-height-cards-in-material-ui
        <>
            <Container sx={{ py: 1 }}>
                <Grid container spacing={2}>
                    <Grid item xs={8} sx={{ my: 2 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }} >
                            {answerCards && answerCards.map((question, index) => (
                                <BingoAnswer
                                    key={index}
                                    question={question}
                                    isCorrect={question.isCorrect}
                                    handleAnswerClick={handleAnswerClick}
                                    index={index}
                                />
                            ))}
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        {questions.length > 0 &&
                            <>
                                <Typography variant='h3' sx={{ my: 2, textAlign: 'center', color: 'secondary.main' }}>
                                    {assignment.assignmentName}
                                </Typography>
                                <Card sx={{ p: 1, mt: 2 }}>
                                    {questions[currentQuestionIndex].question}
                                </Card>
                                <Card sx={{ p: 1, mt: 2 }}>
                                    {questions[currentQuestionIndex].hint}
                                </Card>
                                <h3>Time</h3>
                            </>
                        }
                    </Grid>
                </Grid>
            </Container>
        </>

    )
}