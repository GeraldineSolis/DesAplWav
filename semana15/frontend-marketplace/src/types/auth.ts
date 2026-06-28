export interface User {
  id: number;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}
