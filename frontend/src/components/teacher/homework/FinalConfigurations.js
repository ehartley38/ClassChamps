import { Grid, TextField } from "@mui/material"
import { useState } from "react"

export const FinalConfigurations = () => {
    const [materialName, setMaterialName] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()


    }

    return (
        <>
            <h1>Final Configurations</h1>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="home"
                            label="Material Name"
                            value={materialName}
                            onChange={({ target }) => setMaterialName(target.value)}
                        >
                        </TextField>
                    </form>
                </Grid>
            </Grid>

        </>
    )
}