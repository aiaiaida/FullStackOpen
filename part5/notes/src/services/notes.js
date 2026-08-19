import axios from 'axios'
const baseurl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
    return axios.get(baseurl).then(response=> response.data)
}

const create = async newObject => {
    // return axios.post(baseurl, newObject).then(response=> response.data)
    const config = {
      headers: { Authorization: token }
    }
    const response = await axios.post(baseurl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    return axios.put(`${baseurl}/${id}`, newObject).then(response=> response.data)
}

export default { getAll,create,update,setToken }