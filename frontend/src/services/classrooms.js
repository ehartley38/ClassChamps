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

    const response = await axios.get(baseUrl, config);
    return response.data;
}

const create = async (newObject) => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const deleteClassroom = async (classroom) => {
    const config = {
        headers: { Authorization: token },
    }

    const classroomURL = baseUrl + '/' + classroom.id
    
    await axios.delete(classroomURL, config)
}


export default { create, setToken, getAll, deleteClassroom }