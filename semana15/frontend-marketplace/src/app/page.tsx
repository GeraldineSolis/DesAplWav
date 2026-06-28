import Link from 'next/link';
import { Product, Category, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    const url = categoryId
      ? `${API_URL}/products?categoryId=${categoryId}`
      : `${API_URL}/products`;

    const res = await fetch(url, {
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

const getCategoryStyles = (name: string, isActive: boolean) => {
  const normalized = name.toLowerCase();
  
  if (isActive) {
    if (normalized.includes('computadoras')) return 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20';
    if (normalized.includes('periféricos')) return 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20';
    if (normalized.includes('monitores')) return 'bg-amber-600 text-white shadow-lg shadow-amber-600/20';
    if (normalized.includes('audio')) return 'bg-rose-600 text-white shadow-lg shadow-rose-600/20';
    return 'bg-slate-900 text-white shadow-lg shadow-slate-900/20';
  }
  
  // Inactive states
  if (normalized.includes('computadoras')) return 'bg-white hover:bg-indigo-50/50 text-slate-700 border border-slate-200 hover:border-indigo-300';
  if (normalized.includes('periféricos')) return 'bg-white hover:bg-emerald-50/50 text-slate-700 border border-slate-200 hover:border-emerald-300';
  if (normalized.includes('monitores')) return 'bg-white hover:bg-amber-50/50 text-slate-700 border border-slate-200 hover:border-amber-300';
  if (normalized.includes('audio')) return 'bg-white hover:bg-rose-50/50 text-slate-700 border border-slate-200 hover:border-rose-300';
  return 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300';
};

const getCategoryBadgeStyles = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('computadoras')) return 'bg-indigo-50 text-indigo-700 border border-indigo-100/60';
  if (normalized.includes('periféricos')) return 'bg-emerald-50 text-emerald-700 border border-emerald-100/60';
  if (normalized.includes('monitores')) return 'bg-amber-50 text-amber-700 border border-amber-100/60';
  if (normalized.includes('audio')) return 'bg-rose-50 text-rose-700 border border-rose-100/60';
  return 'bg-slate-100 text-slate-700 border border-slate-200/60';
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams.category;

  const products = await getProducts(categoryId);
  const categories = await getCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center sm:text-left mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
          Descubre nuestra{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Tecnología
          </span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Explora los mejores dispositivos y accesorios de alta gama seleccionados especialmente para ti.
        </p>
      </div>

      {categories.length > 0 && (
        <div className="mb-12 p-6 bg-slate-100/50 rounded-2xl border border-slate-200/50 backdrop-blur-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Filtrar por categoría:</p>
          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/"
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                !categoryId
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/25'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Todos los productos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/?category=${cat.id}`}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                  getCategoryStyles(cat.nombre, categoryId === cat.id.toString())
                }`}
              >
                {cat.nombre}
              </Link>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/60 shadow-xs">
          <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="text-slate-800 font-bold text-xl mb-1">No hay productos disponibles</p>
          <p className="text-slate-400 text-sm">Prueba seleccionando otra categoría o regresa más tarde.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group bg-white border border-slate-200/70 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"
            >
              {product.imageUrl && (
                <div className="w-full h-56 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {product.category && (
                    <span className={`absolute top-4 left-4 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                      getCategoryBadgeStyles(product.category.nombre)
                    }`}>
                      {product.category.nombre}
                    </span>
                  )}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors duration-200 mb-2 line-clamp-1">
                  {product.nombre}
                </h2>

                <div className="flex items-baseline mb-3">
                  <span className="text-xs font-bold text-slate-400 mr-1">S/</span>
                  <span className="text-2xl font-black text-indigo-600">{product.precio}</span>
                </div>

                {product.descripcion && (
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6">
                    {product.descripcion}
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-indigo-600">
                  <span>Ver detalles</span>
                  <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}