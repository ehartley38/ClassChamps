import { Box, Typography } from "@mui/material"

export const BingoAnswer = ({ question, isCorrect, handleAnswerClick }) => {

    return (
        <Box
            sx={{
                width: 150,
                height: 150,
                backgroundColor: isCorrect ? '#59E391' : '#ffb703',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center',
                cursor: 'pointer'
            }}
            onClick={() => handleAnswerClick(question._id)}
        >
            <Typography
            sx={{
                m: 1,
                textAlign: 'center',
                color: 'white'
            }}
            >
                {question.answer}
            </Typography>
        </Box>

    )
}