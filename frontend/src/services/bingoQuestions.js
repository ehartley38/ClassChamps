import axios from 'axios'
const baseUrl = '/api/bingoQuestions'

const create = async (jwt, newObject) => {
    const response = await axios.post(baseUrl, newObject, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.date
}

export default {create}