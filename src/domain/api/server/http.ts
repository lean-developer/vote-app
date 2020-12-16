import axios from 'axios'

export default axios.create({
    baseURL: process.env.VUE_APP_SERVICE,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.VUE_APP_SERVICE_AUTH
    }
  })