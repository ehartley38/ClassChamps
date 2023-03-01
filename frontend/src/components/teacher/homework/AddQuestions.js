import { Box, TextField, Grid, Button } from "@mui/material"
import { useState } from "react"

export const AddQuestions = ({ homeworkType }) => {
    const [questions, setQuestions] = useState([])


    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('submit');
    }

    return (
        <>
            <h1>Add {homeworkType} questions</h1>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="question"
                            label="Question"
                            id="question"
                            autoComplete="Question"
                        >
                        </TextField>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="answer"
                            label="Answer"
                            id="answer"
                            autoComplete="Answer"
                        >

                        </TextField>
                        <TextField
                            margin="normal"
                            fullWidth
                            name="hints"
                            label="Hints"
                            id="hints"
                            autoComplete="Hints"
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
            </Grid>
        </>
    )
}