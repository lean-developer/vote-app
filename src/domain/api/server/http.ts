import axios from 'axios'

export default axios.create({
    baseURL: 'https://icl-vote-service.herokuapp.com/',
    // baseURL: 'http://localhost:3200/',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic YnVrb3dza2k6XzVmRjcjej0/Jlo2P21RNkgh'
    }
  })