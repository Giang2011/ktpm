import { useState } from "react";
import { loginUser } from "@/lib/api/auth";

export function useLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function login(username: string, password: string) {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await loginUser(username, password);
      setIsLoading(false);
      return user;
    } catch (err: any) {
      setIsLoading(false);
      
      // Handle different error types
      if (err.response?.data?.message) {
        // API error with message
        setError(err. response.data.message);
      } else if (err.response?. data) {
        // API error with string response
        setError(typeof err.response.data === 'string' 
          ? err.response.data 
          : 'Đăng nhập thất bại');
      } else if (err.message) {
        // Network or other error
        setError(err.message);
      } else {
        // Unknown error
        setError('Không thể kết nối đến server.  Vui lòng kiểm tra lại.');
      }
      
      console.error('Login error:', err);
      return null;
    }
  }

  return { login, error, isLoading };
}