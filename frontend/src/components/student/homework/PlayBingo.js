import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWindowSize from "react-use/lib/useWindowSize";
import useAuth from "../../../hooks/useAuth";
import { Loading } from "../../Loading";
import { BingoAnswer } from "./BingoAnswer";
import { Timer } from "./Timer";
import Confetti from "react-confetti";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const PlayBingo = ({ assignment }) => {
  const [session, setSession] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answerCards, setAnswerCards] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stopTimer, setStopTimer] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [displayOnLeaderboard, setDisplayOnLeaderboard] = useState(false);
  const [mistakeMade, setMistakeMade] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { width, height } = useWindowSize();
  const { setRecentBadges } = useAuth();
  let navigate = useNavigate();

  // Timer stuff
  const timeNow = new Date();
  const [time, setTime] = useState(undefined); // Current time
  const [endTime, setEndTime] = useState(undefined); // Completion time

  useEffect(() => {
    // Should move duplicate session check to backend
    const initialize = async () => {
      // Check if session exists for this particular assignment
      const sessionResponse = await axiosPrivate.get("/bingoSessions");
      const sessions = sessionResponse.data;

      const count = sessions.filter(
        (session) => session.assignment === assignment.id
      ).length;

      // If session doesn't exist, create a new session
      if (count === 0) {
        // Get all questions for this quiz
        const questionDataResponse = await axiosPrivate.get(
          `/bingoQuestions/getAllByQuiz/${assignment.quizId.id}`
        );
        const questionData = questionDataResponse.data;

        const questions = questionData.map((obj) => {
          return {
            question: obj.question,
            answer: obj.answer,
            hint: obj.hint,
            isCorrect: false,
          };
        });

        const newSession = {
          assignment: assignment.id,
          questions: questions,
        };

        // Create the sesssion
        const savedSessionResponse = await axiosPrivate.post(
          "/bingoSessions",
          newSession
        );
        const savedSession = savedSessionResponse.data;

        setSession(savedSession);
        setQuestions(savedSession.questions);
        setAnswerCards(shuffleArray(savedSession.questions));
        setLoading(false);

        // Set the initial value of `time` only if `session.startTime` is defined
        if (savedSession.startTime) {
          const storedTime = new Date(savedSession.startTime);
          setTime(Math.abs(storedTime.getTime() - timeNow.getTime()));
        }
      } else if (count === 1) {
        // Else if a session exists, load the session
        const currentSession = sessions.filter(
          (session) => session.assignment === assignment.id
        )[0];
        setSession(currentSession);
        setQuestions(currentSession.questions);
        setAnswerCards(shuffleArray(currentSession.questions));
        setLoading(false);
        setMistakeMade(currentSession.mistakeMade);
        setHintUsed(currentSession.hintUsed);

        // Set the initial value of `time` only if `session.startTime` is defined
        if (currentSession.startTime) {
          const storedTime = new Date(currentSession.startTime);
          setTime(Math.abs(storedTime.getTime() - timeNow.getTime()));
        }
      } else {
        console.log("Too many sessions");
      }
    };
    initialize();
  }, []);

  // Check if all questions are answered
  useEffect(() => {
    if (
      currentQuestionIndex !== 0 &&
      questions.length !== 0 &&
      currentQuestionIndex >= questions.length
    ) {
      handleEnd();
    }
  }, [currentQuestionIndex]);

  // Shuffle an array - Used to shuffle order of answer cards
  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  // Handle the clicking of a answer card
  const handleAnswerClick = (questionId) => {
    // Handle correct
    if (questionId === questions[currentQuestionIndex]._id) {
      // Set isCorrect to true for question
      const updatedQuestions = questions.map((q) => {
        if (q._id === questionId) {
          return {
            ...q,
            isCorrect: true,
          };
        }
        return q;
      });

      // Update the session questions
      setQuestions(updatedQuestions);

      // Update isCorrect to true in answerCards
      const updatedAnswerCards = answerCards.map((c) => {
        if (c._id === questionId) {
          return {
            ...c,
            isCorrect: true,
          };
        }
        return c;
      });
      setAnswerCards(updatedAnswerCards);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowHint(false);
    } else {
      // Handle incorrect
      enqueueSnackbar("Incorrect", {
        variant: "warning",
      });
      setMistakeMade(true);
    }
  };

  // Handle the clicking of the save and quit button
  const handleSave = async () => {
    const response = await axiosPrivate.post(
      `/bingoSessions/updateIsCorrect/${session.id}`,
      {
        questionsArray: questions,
        mistakeMade: mistakeMade,
        hintUsed: hintUsed,
      }
    );
    navigate(-1);
  };

  // Handle the clicking of the save and exit button when quiz complete
  const handleEndSave = async () => {
    // Create new submission and return xpGained and awardedBadges
    const submission = {
      assignment: assignment.id,
      timeToComplete: endTime,
      displayOnLeaderboard: displayOnLeaderboard,
      mistakeMade: mistakeMade,
      hintUsed: hintUsed,
    };
    try {
      const response = await axiosPrivate.post(
        "/assignmentSubmissions",
        submission
      );
      const responseData = response.data;
      setRecentBadges(responseData.awardedBadges);
    } catch (err) {}

    // Delete session
    const response = await axiosPrivate.delete(`/bingoSessions/${session.id}`);
    const responseData = response.data;

    navigate(-1, { state: { awardedBadges: responseData.awardedBadges } });
  };

  const handleHintClick = () => {
    setShowHint(true);
    setHintUsed(true);
  };

  const handleCheckbox = async () => {
    displayOnLeaderboard
      ? setDisplayOnLeaderboard(false)
      : setDisplayOnLeaderboard(true);
  };

  const handleEnd = async () => {
    setStopTimer(true);
    setEndTime(time);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    //https://stackoverflow.com/questions/55824260/same-height-cards-in-material-ui
    <>
      <Grid container spacing={4}>
        {/* Display answer cards */}
        <Grid
          item
          container
          xs={8}
          sx={{ my: 3 }}
          justifyContent="center"
          spacing={3}
        >
          {answerCards &&
            answerCards.map((question, index) => (
              <BingoAnswer
                key={index}
                question={question}
                isCorrect={question.isCorrect}
                handleAnswerClick={handleAnswerClick}
                index={index}
              />
            ))}
        </Grid>

        {/* Display Questions, hints, timer etc */}
        <Grid item xs={4}>
          {questions.length > 0 && (
            <>
              <Typography
                variant="h3"
                sx={{ my: 2, textAlign: "center", color: "secondary.main" }}
              >
                {assignment.assignmentName}
              </Typography>
              {questions[currentQuestionIndex]?.isCorrect ? (
                setCurrentQuestionIndex(currentQuestionIndex + 1)
              ) : (
                <>
                  <Card sx={{ p: 1, mt: 2 }}>
                    {questions[currentQuestionIndex]?.question}
                  </Card>
                  {showHint ? (
                    <Card sx={{ p: 1, mt: 2 }}>
                      {questions[currentQuestionIndex]?.hint}
                    </Card>
                  ) : (
                    <Box textAlign="center">
                      <Button onClick={handleHintClick}>Show Hint</Button>
                    </Box>
                  )}
                </>
              )}
              <Timer
                startTime={session.startTime}
                stopTimer={stopTimer}
                time={time}
                setTime={setTime}
              />
            </>
          )}
          <Box textAlign="right">
            <Button onClick={handleSave}>Save and Quit</Button>
          </Box>
        </Grid>
      </Grid>

      {/* Quiz complete modal */}
      {currentQuestionIndex < questions.length ? null : (
        <>
          <Modal open={true}>
            <Box sx={modalStyle}>
              <Typography variant="h3" align="center">
                Congratulations!
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox onChange={handleCheckbox} />}
                  label="Submit to class leaderboard?"
                />
              </FormGroup>
              <Box textAlign="center">
                <Button onClick={handleEndSave}>Save and Exit</Button>
              </Box>
            </Box>
          </Modal>
          <Confetti width={width} height={height} />
        </>
      )}
      <Box>
        <SnackbarProvider />
      </Box>
    </>
  );
};
