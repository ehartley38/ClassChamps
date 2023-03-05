import axios from 'axios'
const baseUrl = '/api/assignments'

// Create an assignment
const create = async (jwt, newObject) => {
    const response = await axios.post(baseUrl, newObject, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

// Get all assignments for a provided classroom
const getByClassroom = async (jwt, classroomId) => {
    const response = await axios.get(`${baseUrl}/classroom/${classroomId}`, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

export default { create, getByClassroom }