import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export const NewClassroom = () => {
  const [roomName, setRoomName] = useState("");
  const axiosPrivate = useAxiosPrivate();

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Add the classroom
      await axiosPrivate.post("/classrooms", {
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
