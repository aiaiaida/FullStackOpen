import axios from 'axios'
const baseurl = 'http://localhost:3001/api/notes'

const getAll = () => {
    return axios.get(baseurl).then(response=> response.data)
}

const create = newObject => {
    return axios.post(baseurl, newObject).then(response=> response.data)
}

const update = (id, newObject) => {
    return axios.put(`${baseurl}/${id}`, newObject).then(response=> response.data)
}

export default { getAll,create,update }