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

const getAll = async (jwt) => {
    const response = await axios.get(baseUrl, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

const deleteQuiz = async (jwt, quizId) => {
    const quizURL = baseUrl + '/' + quizId
    const response = await axios.delete(quizURL, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

export default {create, getAll, deleteQuiz}