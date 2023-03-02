import axios from 'axios'
const baseUrl = '/api/quizzes'

const create = async (jwt, newObject) => {
    const response = await axios.post(baseUrl, newObject, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

export default {create}