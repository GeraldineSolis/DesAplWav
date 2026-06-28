'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Category, ApiResponse } from '@/types/product';
import { useAuth } from '@/context/AuthContext';
import { getToken } from '@/utils/auth';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const getCategoryBadgeStyles = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('computadoras')) return 'bg-indigo-50 text-indigo-700 border border-indigo-100/60';
  if (normalized.includes('periféricos')) return 'bg-emerald-50 text-emerald-700 border border-emerald-100/60';
  if (normalized.includes('monitores')) return 'bg-amber-50 text-amber-700 border border-amber-100/60';
  if (normalized.includes('audio')) return 'bg-rose-50 text-rose-700 border border-rose-100/60';
  return 'bg-slate-100 text-slate-700 border border-slate-200/60';
};

export default function AdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoryId: '',
    imageUrl: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
      fetchCategories();
    }
  }, [authLoading]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data: ApiResponse<Category[]> = await res.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await fetch(`${API_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data: ApiResponse<Product[]> = await res.json();

      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;

    const method = editingId ? 'PUT' : 'POST';
    const token = getToken();

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          descripcion: formData.descripcion || undefined,
          categoryId: formData.categoryId ? parseInt(formData.categoryId) : undefined,
          imageUrl: formData.imageUrl || undefined,
        }),
      });

      if (res.ok) {
        alert(editingId ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        setFormData({
          nombre: '',
          precio: '',
          descripcion: '',
          categoryId: '',
          imageUrl: '',
        });

        setEditingId(null);
        fetchProducts();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Error al guardar producto: ${data.message || res.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error de red: No se pudo conectar con el servidor backend.`);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
      categoryId: product.categoryId?.toString() || '',
      imageUrl: product.imageUrl || '',
    });

    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro?')) return;

    const token = getToken();

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert('Producto eliminado correctamente');
        fetchProducts();
      } else {
        const data = await res.json().catch(() => ({}));
        alert(`Error al eliminar producto: ${data.message || res.statusText}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`Error de red: No se pudo conectar con el servidor backend.`);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: '',
      precio: '',
      descripcion: '',
      categoryId: '',
      imageUrl: '',
    });

    setEditingId(null);
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-semibold text-lg">Cargando consola...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto px-4 py-24">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center shadow-lg shadow-slate-100">
          <span className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
            ⚠️
          </span>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Acceso denegado</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Solo los usuarios con rol de administrador pueden acceder a la consola de gestión de productos.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-slate-950 tracking-tight mb-2">
          Consola de{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Administración
          </span>
        </h1>
        <p className="text-slate-500">Agrega, edita y elimina los artículos tecnológicos de tu inventario.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200/85 rounded-2xl p-6 shadow-xs relative">
            <h2 className="text-xl font-bold text-slate-900 mb-5 pb-3 border-b border-slate-100">
              {editingId ? '✏️ Editar Producto' : '📦 Crear Producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 transition-all text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Precio (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precio: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 transition-all text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 transition-all text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Categoría
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 transition-all text-sm font-bold cursor-pointer"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      imageUrl: e.target.value,
                    })
                  }
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-800 transition-all text-sm font-semibold"
                />
              </div>

              <div className="flex gap-3.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-bold shadow-md shadow-indigo-500/10 hover:shadow-lg transition-all text-sm cursor-pointer"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-600 text-sm cursor-pointer"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">
                      {product.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900">
                      S/ {product.precio}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {product.category ? (
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                          getCategoryBadgeStyles(product.category.nombre)
                        }`}>
                          {product.category.nombre}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Sin categoría</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs cursor-pointer mr-2"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors font-bold text-xs cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}