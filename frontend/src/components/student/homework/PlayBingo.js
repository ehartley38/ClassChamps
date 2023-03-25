import { Box, Button, Card, Checkbox, Container, FormControlLabel, FormGroup, Grid, Modal, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useWindowSize from 'react-use/lib/useWindowSize'
import useAuth from "../../../providers/useAuth"
import bingoQuestionsService from '../../../services/bingoQuestions'
import bingoSessionsService from '../../../services/bingoSessions'
import submissionsService from '../../../services/assignmentSubmissions'
import { Loading } from "../../Loading"
import { BingoAnswer } from "./BingoAnswer"
import { Timer } from "./Timer"
import Confetti from 'react-confetti'

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export const PlayBingo = ({ assignment }) => {
    const [session, setSession] = useState({})
    const [questions, setQuestions] = useState([])
    const [answerCards, setAnswerCards] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [stopTimer, setStopTimer] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [displayOnLeaderboard, setDisplayOnLeaderboard] = useState(false)
    const [mistakeMade, setMistakeMade] = useState(false)

    const { width, height } = useWindowSize()
    let navigate = useNavigate()
    const { jwt, user, setUser } = useAuth()

    // Timer stuff
    const timeNow = new Date()
    const [time, setTime] = useState(undefined) // Current time
    const [endTime, setEndTime] = useState(undefined) // Completion time


    useEffect(() => {
        const initialize = async () => {
            // Check if session exists for this particular assignment
            const sessions = await bingoSessionsService.getUsersSessions(jwt)
            const count = sessions.filter(session => session.assignment === assignment.id).length

            // if session doesn't exist, create a new session
            if (count === 0) {
                // Get all questions for this quiz
                const questionData = await bingoQuestionsService.getAllByQuiz(jwt, assignment.quizId.id)
                const questions = questionData.map(obj => {
                    return {
                        question: obj.question,
                        answer: obj.answer,
                        hint: obj.hint,
                        isCorrect: false,
                    }
                })

                const newSession = {
                    assignment: assignment.id,
                    questions: questions
                }

                // Create the sesssion
                const savedSession = await bingoSessionsService.createSession(jwt, newSession)

                setSession(savedSession)
                setQuestions(savedSession.questions)
                setAnswerCards(shuffleArray(savedSession.questions))
                setLoading(false)

                // Set the initial value of `time` only if `session.startTime` is defined
                if (savedSession.startTime) {
                    const storedTime = new Date(savedSession.startTime)
                    setTime(Math.abs(storedTime.getTime() - timeNow.getTime()))
                }
            } else if (count === 1) {
                // Else load the session
                const currentSession = sessions.filter(session => session.assignment === assignment.id)[0]
                setSession(currentSession)
                setQuestions(currentSession.questions)
                setAnswerCards(shuffleArray(currentSession.questions))
                setLoading(false)
                setMistakeMade(currentSession.mistakeMade)

                // Set the initial value of `time` only if `session.startTime` is defined
                if (currentSession.startTime) {
                    const storedTime = new Date(currentSession.startTime)
                    setTime(Math.abs(storedTime.getTime() - timeNow.getTime()))
                }
            } else {
                console.log('Too many sessions');
            }
        }
        initialize()

    }, [])

    useEffect(() => {
        if (currentQuestionIndex !== 0 && questions.length !== 0 && (currentQuestionIndex >= questions.length)) {
            handleEnd()
        }

    }, [currentQuestionIndex])

    const shuffleArray = (array) => {
        const shuffledArray = [...array]
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };


    const handleAnswerClick = (questionId) => {
        // Handle correct
        if (questionId === questions[currentQuestionIndex]._id) {
            // Set isCorrect to true for question
            const updatedQuestions = questions.map(q => {
                if (q._id === questionId) {
                    return {
                        ...q, isCorrect: true
                    }
                }
                return q
            })

            // Update the session questions
            setQuestions(updatedQuestions)


            // Update isCorrect to true in answerCards
            const updatedAnswerCards = answerCards.map(c => {
                if (c._id === questionId) {
                    return {
                        ...c, isCorrect: true
                    }
                }
                return c
            })
            setAnswerCards(updatedAnswerCards)
            setCurrentQuestionIndex(currentQuestionIndex + 1)
            setShowHint(false)
        } else {
            // Handle incorrect
            setMistakeMade(true)
        }
    }

    const handleSave = async () => {
        const response = await bingoSessionsService.updateQuestions(jwt, session.id, questions, mistakeMade)
        navigate(-1)
    }

    const handleEndSave = async () => {
        // Create new submission and return xpGained
        const submission = {
            assignment: assignment.id,
            timeToComplete: endTime,
            displayOnLeaderboard: displayOnLeaderboard,
            mistakeMade: mistakeMade
        }
        const xpGained = await submissionsService.create(jwt, submission)
        setUser({ ...user, experiencePoints: user.experiencePoints + xpGained })


        // Delete session
        const response = await bingoSessionsService.deleteSession(jwt, session.id)
        navigate(-1)
    }

    const handleCheckbox = async () => {
        displayOnLeaderboard ? setDisplayOnLeaderboard(false) : setDisplayOnLeaderboard(true)
    }

    const handleEnd = async () => {
        setStopTimer(true)
        setEndTime(time)
    }


    if (loading) {
        return (
            <Loading />
        )
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
                                {questions[currentQuestionIndex]?.isCorrect ? (
                                    setCurrentQuestionIndex(currentQuestionIndex + 1)
                                ) : (
                                    <>
                                        <Card sx={{ p: 1, mt: 2 }}>
                                            {questions[currentQuestionIndex]?.question}
                                        </Card>
                                        {showHint ? (
                                            <Card sx={{ p: 1, mt: 2 }}>
                                                {questions[currentQuestionIndex]?.hint}
                                            </Card>
                                        ) : (
                                            <Box textAlign='center'>
                                                <Button onClick={() => setShowHint(true)}>
                                                    Show Hint
                                                </Button>
                                            </Box>
                                        )}

                                    </>
                                )
                                }
                                <Timer startTime={session.startTime} stopTimer={stopTimer} time={time} setTime={setTime} />
                            </>
                        }
                        <Box textAlign='right'>
                            <Button onClick={handleSave}>Save and Quit</Button>
                        </Box>
                    </Grid>
                </Grid>
                {(currentQuestionIndex < questions.length) ? (
                    null
                ) : (
                    <>
                        <Modal
                            open={true}
                        >
                            <Box sx={modalStyle}>
                                <Typography variant="h3" align='center'>
                                    Congratulations!
                                </Typography>
                                <FormGroup>
                                    <FormControlLabel control={<Checkbox onChange={handleCheckbox} />} label="Submit to class leaderboard?" />
                                </FormGroup>
                                <Box textAlign='center'>
                                    <Button
                                        onClick={handleEndSave}
                                    >
                                        Save and Exit
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                        <Confetti
                            width={width}
                            height={height}
                        />
                    </>
                )}
            </Container>

        </>

    )
}