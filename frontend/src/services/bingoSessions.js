import axios from 'axios'
const baseUrl = '/api/bingoSessions'

const createSession = async (jwt, newObject) => {
    const response = await axios.post(baseUrl, newObject, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })

    return response.data
}

// Get all bingo sessions for a given user
const getUsersSessions = async (jwt) => {
    const response = await axios.get(baseUrl, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })

    return response.data
}

// Update an array of questions in a session
const updateQuestions = async (jwt, sessionId, questionsArray, mistakeMade, hintUsed) => {
    const response = await axios.post(`${baseUrl}/updateIsCorrect/${sessionId}`, { questionsArray, mistakeMade, hintUsed }, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })

    return response.data
}

const deleteSession = async (jwt, sessionId) => {
    const response = await axios.delete(`${baseUrl}/${sessionId}`, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

export default { createSession, getUsersSessions, updateQuestions, deleteSession }