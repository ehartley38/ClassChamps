import { Box, CircularProgress, Grid } from "@mui/material"

export const Loading = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
        </div>

    )
}