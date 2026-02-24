import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData)
    return response.data
  }
}

// Soil services
export const soilService = {
  getAll: async () => {
    const response = await api.get('/soil')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/soil/${id}`)
    return response.data
  },
  
  create: async (data) => {
    const response = await api.post('/soil', data)
    return response.data
  },
  
  update: async (id, data) => {
    const response = await api.put(`/soil/${id}`, data)
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/soil/${id}`)
    return response.data
  },
  
  getAssessment: async (id) => {
    const response = await api.get(`/soil/${id}/assessment`)
    return response.data
  }
}

// Crop services
export const cropService = {
  getAll: async (params = {}) => {
    const response = await api.get('/crops', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/crops/${id}`)
    return response.data
  },
  
  getCategories: async () => {
    const response = await api.get('/crops/categories/all')
    return response.data
  }
}

// Fertilizer services
export const fertilizerService = {
  getAll: async (params = {}) => {
    const response = await api.get('/fertilizers', { params })
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/fertilizers/${id}`)
    return response.data
  },
  
  getSustainable: async () => {
    const response = await api.get('/fertilizers/sustainable/top')
    return response.data
  }
}

// Recommendation services
export const recommendationService = {
  getAll: async () => {
    const response = await api.get('/recommendations')
    return response.data
  },
  
  getById: async (id) => {
    const response = await api.get(`/recommendations/${id}`)
    return response.data
  },
  
  generate: async (data) => {
    const response = await api.post('/recommendations/generate', data)
    return response.data
  },
  
  updateStatus: async (id, status) => {
    const response = await api.put(`/recommendations/${id}/status`, { status })
    return response.data
  },
  
  delete: async (id) => {
    const response = await api.delete(`/recommendations/${id}`)
    return response.data
  },
  
  getSustainability: async (id) => {
    const response = await api.get(`/recommendations/${id}/sustainability`)
    return response.data
  }
}

// Weather services
export const weatherService = {
  getCurrent: async (lat, lon) => {
    const response = await api.get('/weather/current', { params: { lat, lon } })
    return response.data
  },
  
  getForecast: async (lat, lon, days = 5) => {
    const response = await api.get('/weather/forecast', { params: { lat, lon, days } })
    return response.data
  }
}

export default api
