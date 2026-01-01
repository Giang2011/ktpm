import { publicApi } from "./client";

export async function loginUser(username: string, password: string) {
  try {
    // Thay đổi: Gửi object dữ liệu vào tham số thứ 2 của post()
    const response = await publicApi.post("/users/login", { 
      username, 
      password 
    });
    
    return response.data;
  } catch (error: any) {
    // In ra chi tiết lỗi để debug dễ hơn
    console.error('API login error:', error.response?.data || error.message);
    throw error;
  }
}
export interface UpdateUserRequest {
  username:  string;
  password:  string;
  role: string; // Changed from email to role
}

export const updateUser = async (userId: number, data: UpdateUserRequest) => {
  const response = await publicApi.put(`/users/${userId}`, data);
  return response.data;
};