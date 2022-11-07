import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(res => res.data)
}

const postNew = newPerson  => {
    const request = axios.post(baseUrl,newPerson)
    return request.then(res=>res.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(res => res.data)
}

const updatePerson = (id, newPerson) => {
    const request = axios.put(`${baseUrl}/${id}`,newPerson)
    return request.then(res => res.data)
}

export default {
    getAll: getAll,
    postNew: postNew,
    deletePerson : deletePerson,
    updatePerson : updatePerson,
}