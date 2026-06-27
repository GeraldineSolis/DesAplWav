export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  categoryId?: number;
  imageUrl?: string;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}