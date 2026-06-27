import Link from 'next/link';
import { Product, Category, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data: ApiResponse<Product[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const data: ApiResponse<Category[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function HomePage() {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Productos
      </h1>

      {categories.length > 0 && (
        <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Filtrar por categoría:</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/?category=${category.id}`}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
              >
                {category.nombre}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No hay productos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {product.imageUrl && (
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.nombre}
                </h2>

                {product.category && (
                  <p className="text-xs text-gray-500 mb-2">
                    {product.category.nombre}
                  </p>
                )}

                <p className="text-2xl font-bold text-gray-900 mb-3">
                  S/ {product.precio}
                </p>

                {product.descripcion && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.descripcion}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}