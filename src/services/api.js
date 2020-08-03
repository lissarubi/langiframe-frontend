import axios from 'axios'

const api = axios.create({
    baseURL: "https://langiframe-backend.herokuapp.com/",
})

export default api
