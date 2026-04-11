import axios from 'axios'

const solarSystemApi = axios.create({
  baseURL: '/solar-api',
})

export { solarSystemApi }
