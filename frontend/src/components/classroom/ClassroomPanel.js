
export const ClassroomPanel = ({ classroom }) => {

    return (
        <div>
            <h3>{classroom.roomName}</h3>
            <button>Details</button>
            <button>Delete</button>
        </div>
    )
}