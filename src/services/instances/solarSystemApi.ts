import axios from 'axios'

const API_BASE_URL = 'https://api.le-systeme-solaire.net/rest/'

const solarSystemApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

export { solarSystemApi }
