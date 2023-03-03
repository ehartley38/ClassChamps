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
    try {
        const response = await axios.post(`${baseUrl}/addAllQuestions`, questionArray, {
            headers: {
                authorization: 'bearer ' + jwt.token
            }
        })
        return response.data
    } catch (err) {
        console.log(err);
    }
}

export default { create, createAll }