# BK Parking - Hệ thống Bãi đỗ xe Thông minh

Dự án Hệ thống Bãi đỗ xe Thông minh (Smart Parking Web Application) được phát triển nhằm tự động hóa quy trình quản lý bãi đỗ xe tại Đại học Bách Khoa TP.HCM (HCMUT). Hệ thống bao gồm đầy đủ các luồng xử lý từ lúc xe vào/ra cổng, ghi nhận nợ tự động, đến thanh toán trực tuyến qua ví nội bộ BKPay.

## 🌟 Các tính năng chính (Core Features)

1. **Quản lý Cổng (Gate Entry/Exit)**:
   - Nhận diện xe vào/ra bằng thẻ từ và mô phỏng nhận diện biển số (ALPR).
   - Hỗ trợ cả sinh viên/nhân viên (Member) và khách vãng lai (Guest Ticket).
   - Xử lý mượt mà kịch bản ghi nợ tự động nếu tài khoản không đủ số dư.
   - Hỗ trợ chế độ hoạt động Ngoại tuyến (Offline mode).

2. **Cổng thanh toán BKPay**:
   - Tích hợp ví điện tử nội bộ cho phép nạp tiền và thanh toán nợ gửi xe chỉ với một chạm.
   - Quản lý lịch sử giao dịch và biên lai.

3. **Dashboard & Quản trị (Admin/Staff)**:
   - Theo dõi doanh thu, số lượng xe đang đỗ, tỷ lệ lấp đầy theo thời gian thực.
   - Sơ đồ bãi xe trực quan (Live Parking Map).
   - Quản lý người dùng, thẻ định danh và thiết bị IoT (Camera, Barrier, Bảng LED).

## 🚀 Hướng dẫn Cài đặt & Chạy dự án (Local Development)

### Yêu cầu hệ thống:
- [Node.js](https://nodejs.org/en/) (phiên bản 18.x hoặc mới hơn).
- [Git](https://git-scm.com/) (để clone dự án - tùy chọn).

### Các bước khởi chạy:

**Bước 1:** Tải mã nguồn về máy và mở Terminal tại thư mục gốc của dự án (`SE252_Smart-Parking-Web`).

**Bước 2:** Cài đặt thư viện cho cả Frontend và Backend.
```bash
# Cài đặt thư viện cho Frontend (Gốc)
npm install

# Cài đặt thư viện cho Backend
cd backend
npm install
cd ..
```

**Bước 3:** Khởi chạy toàn bộ hệ thống bằng một lệnh duy nhất.
```bash
npm run dev:all
```
*Lệnh này sẽ dùng `concurrently` để chạy song song Frontend (Vite) tại `http://localhost:3000` và Backend (Express) tại `http://localhost:5000`.*

---

## 🔑 Tài khoản dùng thử (Test Accounts)

Hệ thống cung cấp sẵn các tài khoản sau để bạn test các phân quyền (Role) khác nhau.

| Vai trò | Email đăng nhập | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hcmut.edu.vn` | `admin123` | Quản trị viên (Full quyền) |
| **Staff** | `staff@hcmut.edu.vn` | `staff123` | Bảo vệ cổng, check-in/out |
| **User** | `user@hcmut.edu.vn` | `user123` | Sinh viên chính quy (Có xe) |
| **User** | `user06@hcmut.edu.vn` | `user123` | Giảng viên |

## 🛠 Công nghệ sử dụng
- **Frontend**: React 19, Vite, Tailwind CSS, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: In-memory JSON (Mô phỏng dữ liệu qua file `db.js`).

---
*Phát triển cho đồ án môn học Công ngệ Phần mềm - Smart Parking System.*
