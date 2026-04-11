import axios from 'axios'

const solarSystemApi = axios.create({
  baseURL: '/solar-api',
  timeout: 10000,
})

export { solarSystemApi }
