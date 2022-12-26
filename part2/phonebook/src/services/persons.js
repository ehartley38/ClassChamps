import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
}

const deleteId = (id) => {
    return axios.delete(`${baseUrl}/${id}`)
}

const updateNumber = (personObject, newNumber) => {
    const request = axios.put(`${baseUrl}/${personObject.id}`, {
        name: personObject.name,
        number: newNumber,
        id: personObject.id
    })
    return request.then(response => response.data)
}

export default { create, deleteId, updateNumber }