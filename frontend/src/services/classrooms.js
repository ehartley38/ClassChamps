import axios from 'axios'
const baseUrl = '/api/classrooms'

let token = null

const setToken = newToken => {
    token = `bearer ${newToken}`
}

const getAll = async (jwt) => {
    const response = await axios.get(baseUrl, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

const getAllStudentClassrooms = async (jwt) => {
    const response = await axios.get(`${baseUrl}/studentClassrooms`, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
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

const create = async (jwt, newObject) => {
    const response = await axios.post(baseUrl, newObject, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
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


const deleteClassroom = async (jwt, classroom) => {
    const classroomURL = baseUrl + '/' + classroom.id

    const response = await axios.delete(classroomURL, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
}

export default { create, setToken, getAll, deleteClassroom, generateClassCode, 
    getById, joinClassByRoomCode, removeStudentFromClassroom, getAllStudentClassrooms,
 }