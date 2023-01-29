import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {  
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const edit = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const blogURL = baseUrl + '/' + newObject.id
  
  const response = await axios.put(blogURL, newObject, config)
  return response.data
}

const deleteBlog = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const blogURL = baseUrl + '/' + newObject.id

  await axios.delete(blogURL, config)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, setToken, create, edit, deleteBlog }