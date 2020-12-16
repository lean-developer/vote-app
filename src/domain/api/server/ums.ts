import axios from 'axios'

export default axios.create({
  baseURL: process.env.VUE_APP_SERVICE_UMS,
  headers: {
    'Content-Type': 'application/json'
  }
})
