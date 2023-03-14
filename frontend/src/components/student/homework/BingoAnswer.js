import { Box, Typography } from "@mui/material"

export const BingoAnswer = ({ answer }) => {

    return (
        <Box
            sx={{
                width: 150,
                height: 150,
                backgroundColor: '#ffb703',
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent:'center'
            }}
        >
            <Typography
            sx={{
                m: 1,
                textAlign: 'center'
            }}
            >
                {answer}
            </Typography>
        </Box>

    )
}