import {
  Button,
  Grid,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FixedSizeList } from "react-window";
import useAuth from "../../../providers/useAuth";
import classroomService from "../../../services/classrooms";
import assignmentService from "../../../services/assignments";
import quizzesService from "../../../services/quizzes";
import { Student } from "./Student";
import { HomeworkPanel } from "./HomeworkPanel";

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
  const { jwt } = useAuth();

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        const classroomData = await classroomService.getById(
          jwt,
          classroomObject.id
        );
        setClassroom(classroomData);

        const assignmentData = await assignmentService.getByClassroom(
          jwt,
          classroomObject.id
        );
        setActiveHomework(assignmentData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClassroomData();
  }, []);

  const handleGenerate = async () => {
    try {
      const updatedClassroom = await classroomService.generateClassCode(
        jwt,
        classroomObject
      );
      setClassroom(updatedClassroom);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignToggle = async () => {
    setAssignHomework(true);
    const quizList = await quizzesService.getAll(jwt);

    setQuizList(quizList);
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
      const response = await assignmentService.create(jwt, newAssignment);
      setActiveHomework([...activeHomework, response]);
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
        <h1>{classroom.roomName}</h1>
        {classroom.roomCode ? (
          <> Your unique room code is {<b>{classroom.roomCode}</b>}</>
        ) : (
          <>Generate your unique room code</>
        )}
        <Button onClick={() => handleGenerate()}>
          {classroom.roomCode ? "New code" : "Generate"}
        </Button>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <h3>Assign Homework</h3>
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
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleAssign}>Assign</button>
              </>
            ) : (
              <button onClick={handleAssignToggle}>Assign Homework</button>
            )}
          </Grid>
          <Grid item xs={4}>
            <h3>Active homework</h3>
            {activeHomework &&
              activeHomework.map((assignment) => (
                <HomeworkPanel key={assignment.id} assignment={assignment} />
              ))}
          </Grid>
          <Grid item xs={4}>
            <h3>Students</h3>
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
