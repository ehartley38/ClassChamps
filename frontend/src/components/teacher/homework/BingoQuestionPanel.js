import { ListItemText } from "@mui/material"

export const BingoQuestionPanel = ({ question }) => {
    if (!question) return null

    return (
        <>
            {question.question}
            <br></br>
        </>
    )
}