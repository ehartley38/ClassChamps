import { FormControl, InputLabel, Typography, MenuItem, Box, Select, Button } from "@mui/material"
import { useState } from "react"


// https://mui.com/material-ui/react-select/
export const SelectHomeworkType = () => {
    const [homeworkType, setHomeworkType] = useState('');

    const handleChange = (event) => {
        setHomeworkType(event.target.value);
    }



    return (
        <>
            <Box sx={{ minWidth: 120, pt: 5 }}>
                <FormControl fullWidth>
                    <InputLabel id="homework-type-label">Select Homework Type</InputLabel>
                    <Select
                        labelId="homework-type"
                        id="homework-type"
                        value={homeworkType}
                        label="homework-type"
                        onChange={handleChange}
                    >
                        <MenuItem value={'Bingo'}>Bingo</MenuItem>
                        <MenuItem value={'MultiChoice'}>Multi-Choice Quiz</MenuItem>
                    </Select>
                </FormControl>
            </Box>
        </>

    );
}