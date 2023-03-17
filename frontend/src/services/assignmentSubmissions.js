import axios from 'axios'
const baseUrl = '/api/assignmentSubmissions'

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

const getAllByUser = async (jwt) => {
    const response = await axios.get(baseUrl, {
        headers: {
            authorization: 'bearer ' + jwt.token
        }
    })
    return response.data
}

export default { create, getAllByUser }