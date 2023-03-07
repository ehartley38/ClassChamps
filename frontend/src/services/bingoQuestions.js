import axios from 'axios'
const baseUrl = '/api/bingoQuestions'

const create = async (jwt, newObject) => {
    try {
        const response = await axios.post(baseUrl, newObject, {
            headers: {
                authorization: 'bearer ' + jwt.token
            }
        })
        return response.data
    } catch (err) {
        console.log(err);
    }

}

// Send the array of question objects
const createAll = async (jwt, questionArray) => {

    const response = await axios.post(`${baseUrl}/addAllQuestions`, questionArray, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data

}

// Get all bingo questions for a given quiz
const getAllByQuiz = async (jwt, quizId) => {

    const response = await axios.get(`${baseUrl}/getAllByQuiz/${quizId}`, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })

    return response.data
}

export default { create, createAll, getAllByQuiz }