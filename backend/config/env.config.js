// backend/config/env.js
// Load và export các biến môi trường
// Tạo file .env (copy từ .env.example) và điền giá trị thực

require('dotenv').config()

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  JWT_SECRET: process.env.JWT_SECRET || 'bkparking_dev_secret_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',

  // Các origin được phép gọi API
  // Mặc định: localhost:3000
  // Thêm IP mạng LAN hoặc domain vào ALLOWED_ORIGINS (ngăn cách bằng dấu phẩy)
  // Ví dụ trong .env: ALLOWED_ORIGINS=http://192.168.1.5:3000,https://mysite.com
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : null, // null = dùng CLIENT_URL
}
