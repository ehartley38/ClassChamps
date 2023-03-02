import { Box, TextField, Grid, Button, ListItem, ListItemButton, ListItemText, List } from "@mui/material"
import { useState } from "react"
import { FixedSizeList } from 'react-window'
import { BingoQuestionPanel } from "./BingoQuestionPanel"
//import { BingoQuestionPanel } from "./BingoQuestionPanel"


export const AddQuestions = ({ quizType, questionList, setQuestionList }) => {

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [hint, setHint] = useState('')


    const handleSubmit = (e) => {
        e.preventDefault()

        setQuestionList([...questionList, {
            question: question,
            answer: answer,
            hint: hint
        }])

        setQuestion('')
        setAnswer('')
        setHint('')

    }

    

    return (
        <>
            <h1>Add {quizType} questions</h1>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="question"
                            label="Question"
                            value={question}
                            onChange={({ target }) => setQuestion(target.value)}
                        >
                        </TextField>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Answer"
                            id="answer"
                            value={answer}
                            onChange={({ target }) => setAnswer(target.value)}
                        >

                        </TextField>
                        <TextField
                            margin="normal"
                            fullWidth
                            name="hints"
                            label="Hint"
                            id="hints"
                            value={hint}
                            onChange={({ target }) => setHint(target.value)}
                        >

                        </TextField>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Add
                        </Button>
                    </form>

                </Grid>
                <Grid item xs={4}>
                    {questionList && questionList.map((q,i) =>
                        <BingoQuestionPanel key={i} question={q} />
                    )}
                </Grid>

            </Grid>
        </>
    )
}

