import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    //console.log(`Request: ${request.body}`);
    return request.then(response => response.data)
}

const deleteId = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updateNumber = (personObject, newNumber) => {
    const request = axios.put(`${baseUrl}/${personObject.id}`, {
        name: personObject.name,
        number: newNumber,
    })
    return request.then(response => response.data)
}

export default { create, deleteId, updateNumber }