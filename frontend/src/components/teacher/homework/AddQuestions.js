import { Box, TextField, Grid, Button, ListItem, ListItemButton, ListItemText, List, IconButton } from "@mui/material"
import { useState } from "react"
import { FixedSizeList } from 'react-window'
import { BingoQuestionPanel } from "./BingoQuestionPanel"
//import { BingoQuestionPanel } from "./BingoQuestionPanel"

export const Row = ({ index, style, questionList, handleClick }) => (
    /*
    <div style={style}>
        {questionList && questionList[index] && questionList[index].question}
    </div>
    */

    <ListItem style={style} key={index}>
        <ListItemButton onClick={() => handleClick(questionList[index], index)}>
            <ListItemText primary={questionList[index].question} />
        </ListItemButton>
    </ListItem>
)

export const AddQuestions = ({ quizType, questionList, setQuestionList }) => {

    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [hint, setHint] = useState('')
    const [edit, setEdit] = useState(false)
    const [editableIndex, setEditableIndex] = useState()


    const handleSubmit = () => {
        setQuestionList([...questionList, {
            question: question,
            answer: answer,
            hint: hint
        }])

        setQuestion('')
        setAnswer('')
        setHint('')
    }

    const handleClick = (question, i) => {
        setQuestion(question.question)
        setAnswer(question.answer)
        setHint(question.hint)
        setEdit(true)
        setEditableIndex(i)
    }

    const handleEdit = () => {
        const newQuestionList = questionList.map((q, i) => {
            if (i === editableIndex) {
                return {
                    question: question,
                    answer: answer,
                    hint: hint
                }
            }
            return q
        })

        setQuestionList(newQuestionList)
        setQuestion('')
        setAnswer('')
        setHint('')
        setEdit(false)
    }

    const handleBack = () => {
        setQuestion('')
        setAnswer('')
        setHint('')
        setEdit(false)
    }

    return (
        <>
            <h1>Add {quizType} questions</h1>
            <Grid container spacing={2}>
                <Grid item xs={8}>
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
                    {edit ? (
                        <>
                            <Button
                                onClick={handleEdit}
                                variant="contained"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleBack}
                                variant="contained"
                            >
                                Back
                            </Button>
                            
                        </>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="success"
                        >
                            Add
                        </Button>
                    )}

                </Grid>
                <Grid item xs={4}>
                    <FixedSizeList
                        height={400}
                        width={360}
                        itemSize={46}
                        itemCount={questionList.length}
                    >
                        {({ index, style }) => <Row index={index} style={style} questionList={questionList} handleClick={handleClick} />}
                    </FixedSizeList>
                </Grid>

            </Grid>
        </>
    )
}

