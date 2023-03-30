import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classroomService from "../../../services/classrooms";
import useAuth from "../../../hooks/useAuth";

export const NewClassroom = () => {
  const [roomName, setRoomName] = useState("");
  const { auth } = useAuth();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the classroom
      const returnedClassroom = await classroomService.create(auth.jwt, {
        roomName: roomName,
      });

      setRoomName("");
      navigate("/teacher/classrooms");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1>Create new classroom</h1>
      <form onSubmit={handleSubmit}>
        Room name
        <input
          id="roomname"
          value={roomName}
          onChange={({ target }) => setRoomName(target.value)}
        />
        <button type="submit">Create Classroom</button>
      </form>
    </div>
  );
};
