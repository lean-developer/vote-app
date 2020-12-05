import axios from 'axios'

export default axios.create({
  baseURL: 'https://ums-service.herokuapp.com/',
  headers: {
    'Content-Type': 'application/json'
  }
})
