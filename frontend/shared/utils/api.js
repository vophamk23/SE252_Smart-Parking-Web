// frontend/shared/utils/api.js
import axios from 'axios'

// Lấy URL từ biến môi trường của Vite, fallback về máy chủ hiện tại theo hostname để hỗ trợ LAN
const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:3001/api`

// Khởi tạo axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Tự động đính kèm Token vào Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Tự động xử lý lỗi 401 (Hết hạn Token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ -> Xóa token và bắt đăng nhập lại
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Chuyển hướng người dùng về trang đăng nhập nếu không phải đang ở trang login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?expired=true'
      }
    }
    return Promise.reject(error)
  }
)

export default api
