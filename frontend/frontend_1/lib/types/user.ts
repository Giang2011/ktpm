export interface User {
    id: number;
    username: string;
    role: string;
    createdAt: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface CreateUserRequest {
    username: string;
    password: string;
    role: string;
  }
  
  export interface UpdateUserRequest extends CreateUserRequest {}