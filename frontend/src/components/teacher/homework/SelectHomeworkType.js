import { FormControl, InputLabel, Typography, MenuItem, Box, Select, Button } from "@mui/material"
import { useState } from "react"


// https://mui.com/material-ui/react-select/
export const SelectHomeworkType = ({ setHomeworkType, homeworkType }) => {

    
    return (
        <>
            <Box sx={{ minWidth: 120, pt: 5 }}>
                <FormControl fullWidth>
                    <InputLabel id="homework-type-label">Select Homework Type</InputLabel>
                    <Select
                        labelId="homework-type"
                        id="homework-type"
                        label="homework-type"
                        value={homeworkType}
                        onChange={({ target }) => setHomeworkType(target.value)}
                    >
                        <MenuItem value={'Bingo'}>Bingo</MenuItem>
                        <MenuItem value={'MultiChoice'}>Multi-Choice Quiz</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>

    );
}