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

export default { createSession, getUsersSessions }