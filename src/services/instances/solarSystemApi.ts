import axios from 'axios'

const solarSystemApi = axios.create({
  baseURL: '/solar-api',
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_SOLAR_API_KEY}`,
  },
})

export { solarSystemApi }
