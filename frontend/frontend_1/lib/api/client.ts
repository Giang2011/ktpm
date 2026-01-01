import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import Cookies from "js-cookie";

// Sửa đổi URL cơ sở để khớp với Backend Spring Boot của giang2011
// Thường chạy ở cổng 8080 và sử dụng tiền tố /api
const API_URL = "http://localhost:8080/api";

// Tạo thực thể axios công khai (không yêu cầu xác thực)
export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Tạo thực thể axios riêng tư (có yêu cầu xác thực)
export const privateApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Cho phép gửi cookies nếu cần
});

// Thêm interceptor cho yêu cầu để đính kèm token xác thực vào header
privateApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ cookie có tên 'auth_token'
    const token = Cookies.get("auth_token");
    if (token && config.headers) {
      // Đính kèm token theo chuẩn Bearer xác thực của backend
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho phản hồi để xử lý các lỗi chung (ví dụ: hết hạn token)
privateApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Xử lý khi truy cập không được phép (ví dụ: token hết hạn hoặc không hợp lệ)
      // Xóa các token cũ và chuyển hướng người dùng về trang đăng nhập
      Cookies.remove("auth_token");
      window.location.href = "/auth"; // Trang đăng nhập của repository mikouwu24
    }
    return Promise.reject(error);
  }
);