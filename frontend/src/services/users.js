import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const signUp = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

const getUserDetails = async (jwt) => {
  const request = await axios.get((baseUrl + '/id'), {
    headers: {
      authorization: 'bearer ' + jwt.token
    }
  })
  return request.data
}



export default { setToken, signUp, getUserDetails }