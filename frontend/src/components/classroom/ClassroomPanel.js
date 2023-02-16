
export const ClassroomPanel = ({ classroom, deleteClassroom }) => {

    return (
        <div>
            <h3>{classroom.roomName}</h3>
            <button>Details</button>
            <button onClick={() => deleteClassroom(classroom)}>Delete</button>
        </div>
    )
}