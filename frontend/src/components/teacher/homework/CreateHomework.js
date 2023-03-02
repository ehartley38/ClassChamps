import { AppBar, Box, Button, Container, Paper, Step, StepLabel, Stepper, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { AddQuestions } from "./AddQuestions";
import { FinalConfigurations } from "./FinalConfigurations";
import { SelectHomeworkType } from "./SelectHomeworkType";

const steps = ['Select Homework Type', 'Create Questions', 'Final tweaks'];

// https://github.com/mui/material-ui/tree/v5.11.10/docs/data/material/getting-started/templates/checkout
export const CreateHomework = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [homeworkType, setHomeworkType] = useState('');
    const [questionList, setQuestionList] = useState([{
      question: "",
      answer: "",
      hint: ""
  }])

    const handleNext = () => {
      setActiveStep(activeStep + 1);
    }
  
    const handleBack = () => {
      setActiveStep(activeStep - 1);
    }

    const getStepContent = (step) => {
  switch (step) {
    case 0:
      return <SelectHomeworkType setHomeworkType={setHomeworkType} homeworkType={homeworkType} />;
    case 1:
      return <AddQuestions homeworkType={homeworkType} questionList={questionList} setQuestionList={setQuestionList} />;
    case 2:
      return <FinalConfigurations />;
    default:
      throw new Error('Unknown step');
  }
}
  
    return (
        <>
        <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
            <Typography component="h1" variant="h4" align="center">
              Create Homework
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
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {activeStep !== 0 && (
                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                      Back
                    </Button>
                  )}
  
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 3, ml: 1 }}
                  >
                    {activeStep === steps.length - 1 ? 'Create Material' : 'Next'}
                  </Button>
                </Box>
              </>
            )}
        </Container>
        </>
    );
    
   
}