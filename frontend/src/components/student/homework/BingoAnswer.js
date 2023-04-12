import { Box, Grid, Typography } from "@mui/material";

export const BingoAnswer = ({ question, isCorrect, handleAnswerClick }) => {
  return (
    <Grid item xs={3}>
      <Box
        sx={{
          borderRadius: 3,
          cursor: "pointer",
          aspectRatio: "1/1",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
          border: "1px solid #ccc",
          backgroundImage: isCorrect
            ? "linear-gradient(135deg, #59E391, #7ECEC1)"
            : "linear-gradient(135deg, #ffb703, #ffc400)",
        }}
        onClick={() => {
          handleAnswerClick(question._id);
        }}
      >
        <Typography
          sx={{
            m: 1,
            textAlign: "center",
            color: "white",
          }}
        >
          {question.answer}
        </Typography>
      </Box>
    </Grid>
  );
};
