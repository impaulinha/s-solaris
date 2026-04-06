import axios from 'axios'

const API_BASE_URL = 'https://images-api.nasa.gov'

const nasaApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export { nasaApi }
