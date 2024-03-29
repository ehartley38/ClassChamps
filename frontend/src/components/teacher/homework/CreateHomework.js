import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AddQuestions } from "./AddQuestions";
import { FinalConfigurations } from "./FinalConfigurations";
import { SelectHomeworkType } from "./SelectHomeworkType";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const steps = ["Select Quiz Type", "Create Questions", "Final Configurations"];

// https://github.com/mui/material-ui/tree/v5.11.10/docs/data/material/getting-started/templates/checkout
export const CreateHomework = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [quizType, setQuizType] = useState("");
  const [quizName, setQuizName] = useState("");
  const [questionList, setQuestionList] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SelectHomeworkType setQuizType={setQuizType} quizType={quizType} />
        );
      case 1:
        return (
          <AddQuestions
            quizType={quizType}
            questionList={questionList}
            setQuestionList={setQuestionList}
          />
        );
      case 2:
        return (
          <FinalConfigurations quizName={quizName} setQuizName={setQuizName} />
        );

      default:
        throw new Error("Unknown step");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const quizObject = {
      quizName: quizName,
      quizType: quizType,
    };

    try {
      // Create quiz first
      const returnedQuiz = await axiosPrivate.post("/quizzes", quizObject);

      // Then loop through questionList and create each question document
      const questionObjects = questionList.map((question) => ({
        parentQuiz: returnedQuiz.data.id,
        question: question.question,
        answer: question.answer,
        hint: question.hint,
      }));

      try {
        const response = await axiosPrivate.post(
          "/bingoQuestions/addAllQuestions",
          questionObjects
        );

        navigate(`/teacher/homework`);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          textAlign="center"
          sx={{ color: "primary.main", my: 2 }}
        >
          Create Quiz
        </Typography>
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length ? (
          <>
            <Typography variant="h5" gutterBottom>
              Homework created
            </Typography>
          </>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              {activeStep !== 0 && (
                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                  Back
                </Button>
              )}
              {activeStep !== steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  sx={{ mt: 3, ml: 1 }}
                >
                  Create Quiz
                </Button>
              )}
            </Box>
          </>
        )}
      </Container>
    </>
  );
};
