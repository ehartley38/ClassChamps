import {
  FormControl,
  InputLabel,
  MenuItem,
  Box,
  Select,
  Button,
} from "@mui/material";

// https://mui.com/material-ui/react-select/
export const SelectHomeworkType = ({ setQuizType, quizType }) => {
  return (
    <>
      <Box sx={{ minWidth: 120, pt: 5 }}>
        <FormControl fullWidth>
          <InputLabel id="quiz-type-label">Select Quiz Type</InputLabel>
          <Select
            labelId="quiz-type"
            id="quiz-type"
            label="quiz-type"
            value={quizType}
            onChange={({ target }) => setQuizType(target.value)}
          >
            <MenuItem value={"Bingo"}>Bingo</MenuItem>
            <MenuItem value={"MultiChoice"}>Sequential</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </>
  );
};
