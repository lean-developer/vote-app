import axios from 'axios'

export default axios.create({
    baseURL: 'https://icl-vote-service.herokuapp.com/',
    // baseURL: 'http://localhost:3200/',
    headers: {
      'Content-Type': 'application/json'
    }
  })