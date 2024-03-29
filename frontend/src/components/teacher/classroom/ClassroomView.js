import {
  Box,
  Button,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FixedSizeList } from "react-window";

import { Student } from "./Student";
import { HomeworkPanel } from "./HomeworkPanel";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const Row = ({ index, style, quizList, handleClick, selectedIndex }) => {
  return (
    <ListItem style={style} key={index}>
      <ListItemButton
        onClick={() => handleClick(quizList[index], index)}
        selected={selectedIndex === index}
      >
        <ListItemText primary={quizList[index].quizName} />
      </ListItemButton>
    </ListItem>
  );
};

export const ClassroomView = () => {
  const location = useLocation();
  const classroomObject = location.state.classroom;
  const [classroom, setClassroom] = useState();
  const [assignHomework, setAssignHomework] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState();
  const [selectedQuizId, setSelectedQuizId] = useState();
  const [dueDate, setDueDate] = useState("");
  const [activeHomework, setActiveHomework] = useState([]);
  const [assignmentName, setAssignmentName] = useState("");
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      const classroomData = await axiosPrivate.get(
        `/classrooms/${classroomObject.id}`
      );
      const assignmentData = await axiosPrivate.get(
        `/assignments/classroom/${classroomObject.id}`
      );

      setClassroom(classroomData.data);
      setActiveHomework(assignmentData.data);
    };

    fetchData();
  }, []);

  const handleGenerate = async () => {
    try {
      const updatedClassroom = await axiosPrivate.put(
        `/classrooms/${classroomObject.id}/generate-code`,
        classroomObject
      );
      setClassroom(updatedClassroom.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignToggle = async () => {
    setAssignHomework(true);
    const quizList = await axiosPrivate.get("/quizzes");
    setQuizList(quizList.data);
  };

  const handleCancel = () => {
    setAssignHomework(false);
    setSelectedIndex();
    setDueDate("");
    setAssignmentName("");
  };

  const handleClick = (quiz, index) => {
    setSelectedIndex(index);
    setSelectedQuizId(quiz.id);
  };

  const handleAssign = async () => {
    // Create assigned homework using quizId
    const newAssignment = {
      assignmentName: assignmentName,
      quizId: selectedQuizId,
      classroomId: classroom.id,
      dueDate: dueDate,
    };

    try {
      const savedAssignment = await axiosPrivate.post(
        "/assignments",
        newAssignment
      );
      setActiveHomework([...activeHomework, savedAssignment.data]);
    } catch (err) {
      console.log(err);
    } finally {
      setSelectedIndex();
      setDueDate("");
      setAssignmentName("");
      setAssignHomework(false);
    }
  };

  if (classroom)
    return (
      <>
        <Typography variant="h2" sx={{ color: "primary.main", my: 2 }}>
          {classroom.roomName}
        </Typography>
        <Box sx={{ my: 2 }}>
          {classroom.roomCode ? (
            <> Your unique room code is {<b>{classroom.roomCode}</b>}</>
          ) : (
            <>Generate your unique room code</>
          )}
          <Button onClick={() => handleGenerate()}>
            {classroom.roomCode ? "New code" : "Generate"}
          </Button>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="h3" textAlign="center" sx={{ mb: 2 }}>
              Create New Assignment
            </Typography>
            {assignHomework ? (
              <>
                <h5>Name</h5>
                <TextField
                  sx={{ mb: 3 }}
                  required
                  fullWidth
                  id="assignmentName"
                  label="AssignmentName"
                  value={assignmentName}
                  onChange={({ target }) => setAssignmentName(target.value)}
                ></TextField>
                <FixedSizeList
                  height={100}
                  width={360}
                  itemSize={50}
                  itemCount={quizList.length}
                >
                  {({ index, style }) => (
                    <Row
                      index={index}
                      style={style}
                      quizList={quizList}
                      handleClick={handleClick}
                      selectedIndex={selectedIndex}
                    />
                  )}
                </FixedSizeList>
                <h5>Select due date</h5>
                <DatePicker
                  value={dueDate}
                  onChange={(date) => setDueDate(date)}
                />
                <br></br>
                <Box sx={{ py: 2 }}>
                  <Button onClick={handleCancel}>Cancel</Button>
                  <Button onClick={handleAssign}>Assign</Button>
                </Box>
              </>
            ) : (
              <Box textAlign="center">
                <Button onClick={handleAssignToggle}>Create</Button>
              </Box>
            )}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h3" textAlign="center" sx={{ mb: 2 }}>
              Active Assignments
            </Typography>
            {activeHomework &&
              activeHomework.map((assignment) => (
                <HomeworkPanel key={assignment.id} assignment={assignment} />
              ))}
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h3" textAlign="center" sx={{ mb: 2 }}>
              Students
            </Typography>
            {classroom.students &&
              classroom.students.map((student) => (
                <Student
                  key={student.id}
                  student={student}
                  classroom={classroom}
                  setClassroom={setClassroom}
                  handleClick={handleClick}
                />
              ))}
          </Grid>
        </Grid>
      </>
    );
};
