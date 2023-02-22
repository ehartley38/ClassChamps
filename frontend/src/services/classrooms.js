import axios from 'axios'
const baseUrl = '/api/classrooms'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async () => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.get(baseUrl, config)
    return response.data
}

const getById = async (jwt, classroomId) => {
    const response = await axios.get(`${baseUrl}/${classroomId}`, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })

    return response.data
}

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

// Call the backend to generate the unique room code
const generateClassCode = async (jwt, classroomObject) => {
    const response = await axios.put(
        `${baseUrl}/${classroomObject.id}/generate-code`, classroomObject, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

// Add the user to the classroom using the room code
const joinClassByRoomCode = async (jwt, roomCode) => {
    try {
        const response = await axios.put(
            `${baseUrl}/join`, {roomCode}, {
                headers: {
                    authorization: 'bearer ' + jwt.token
                }
            }
        )
        return response.data
    } catch (err) {
        return err.response.data
    }
   
}

const removeStudentFromClassroom = async (jwt, classId, userId) => {
    const response = await axios.put(
        `${baseUrl}/${classId}/removeUser/${userId}`, {}, {
            headers: {
                authorization: 'bearer ' + jwt.token
            }
        }
    )
    return response.data;
}


const deleteClassroom = async (classroom) => {
    const config = {
        headers: { Authorization: token },
    }

    const classroomURL = baseUrl + '/' + classroom.id

    await axios.delete(classroomURL, config)
}

export default { create, setToken, getAll, deleteClassroom, generateClassCode, 
    getById, joinClassByRoomCode, removeStudentFromClassroom }