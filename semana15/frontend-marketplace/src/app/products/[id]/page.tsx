import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

const getCategoryBadgeStyles = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('computadoras')) return 'bg-indigo-50 text-indigo-700 border border-indigo-100/60';
  if (normalized.includes('periféricos')) return 'bg-emerald-50 text-emerald-700 border border-emerald-100/60';
  if (normalized.includes('monitores')) return 'bg-amber-50 text-amber-700 border border-amber-100/60';
  if (normalized.includes('audio')) return 'bg-rose-50 text-rose-700 border border-rose-100/60';
  return 'bg-slate-100 text-slate-700 border border-slate-200/60';
};

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-all duration-200 hover:-translate-x-1"
      >
        <span>←</span> Volver a productos
      </Link>

      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          <div className="w-full">
            {product.imageUrl ? (
              <div className="w-full aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                <img
                  src={product.imageUrl}
                  alt={product.nombre}
                  className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                <span className="text-4xl">📷</span>
                <span className="text-xs mt-2 font-bold uppercase tracking-wider">Sin imagen</span>
              </div>
            )}
          </div>

          <div className="flex flex-col h-full pt-2">
            {product.category && (
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded-md border ${
                  getCategoryBadgeStyles(product.category.nombre)
                }`}>
                  {product.category.nombre}
                </span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-4">
              {product.nombre}
            </h1>

            <div className="flex items-baseline py-4 border-y border-slate-100 mb-6">
              <span className="text-base font-extrabold text-slate-400 mr-1.5">S/</span>
              <span className="text-4xl font-black text-indigo-600">{product.precio}</span>
            </div>

            {product.descripcion && (
              <div className="mb-6">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                  Descripción del Producto
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm font-medium">
                  {product.descripcion}
                </p>
              </div>
            )}

            <div className="mt-auto pt-6 border-t border-slate-100 text-xs font-bold text-slate-400">
              ID del producto: {product.id}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}