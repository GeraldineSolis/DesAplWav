'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

type Author = {
  id: string
  name: string
  email: string
  nationality?: string
  _count?: {
    books: number
  }
}

export default function Dashboard() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nationality, setNationality] = useState('')
  const [bio, setBio] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)

  const fetchAuthors = async () => {
    setLoading(true)
    const res = await fetch('/api/authors')
    const data = await res.json()
    if (Array.isArray(data)) setAuthors(data)
    setLoading(false)
  }

  useEffect(() => { fetchAuthors() }, [])

  const handleCreateAuthor = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/authors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, nationality, bio, birthYear })
    })
    if (res.ok) {
      setName(''); setEmail(''); setNationality(''); setBio(''); setBirthYear('')
      setFormOpen(false)
      fetchAuthors()
    } else {
      alert('Error al registrar autor')
    }
  }

  const handleDeleteAuthor = async (id: string) => {
    if (!confirm('¿Seguro que deseas eliminar este autor?')) return
    const res = await fetch(`/api/authors/${id}`, { method: 'DELETE' })
    if (res.ok) fetchAuthors()
  }

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Barra superior */}
      <header className="border-b border-stone-200 bg-[#FAF8F4]">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900" style={{ fontFamily: "'Georgia', serif" }}>
                Biblioteca
              </h1>
              <p className="text-xs text-stone-400 tracking-widest uppercase" style={{ fontFamily: "system-ui, sans-serif" }}>
                Sistema de Gestión
              </p>
            </div>
          </div>
          <Link
            href="/books"
            className="text-sm px-5 py-2.5 bg-stone-900 text-amber-50 rounded-sm tracking-wide hover:bg-stone-800 transition-colors"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            Explorar libros →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10 space-y-10">

        {/* Encabezado de sección + stat */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs tracking-widest uppercase text-amber-700 mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
              Catálogo de Autores
            </p>
            <h2 className="text-4xl font-bold text-stone-900 leading-tight">
              {loading ? '—' : authors.length} autor{authors.length !== 1 ? 'es' : ''}
            </h2>
            <p className="text-stone-500 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              registrados en el sistema
            </p>
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="flex items-center gap-2 text-sm px-5 py-2.5 border border-stone-900 text-stone-900 rounded-sm hover:bg-stone-900 hover:text-amber-50 transition-colors"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {formOpen ? '✕ Cancelar' : '＋ Nuevo autor'}
          </button>
        </div>

        {/* Formulario desplegable */}
        {formOpen && (
          <div className="bg-white border border-stone-200 rounded-sm p-8 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-6">Registrar nuevo autor</h3>
            <form onSubmit={handleCreateAuthor}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Nombre completo *
                  </label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                    placeholder="Ej. Gabriel García Márquez"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Correo electrónico *
                  </label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                    placeholder="autor@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Nacionalidad
                  </label>
                  <input
                    type="text" value={nationality} onChange={(e) => setNationality(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                    placeholder="Ej. Colombiana"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                    Año de nacimiento
                  </label>
                  <input
                    type="number" value={birthYear} onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                    placeholder="1927"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Biografía corta
                </label>
                <textarea
                  value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                  className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm resize-none"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                  placeholder="Breve descripción sobre el autor..."
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button" onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 text-sm text-stone-600 border border-stone-200 rounded-sm hover:bg-stone-50 transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-sm bg-stone-900 text-amber-50 rounded-sm hover:bg-stone-800 transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  Guardar autor
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Divisor decorativo */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-stone-200 flex-1" />
          <span className="text-stone-300 text-xs tracking-widest" style={{ fontFamily: "system-ui, sans-serif" }}>◆</span>
          <div className="h-px bg-stone-200 flex-1" />
        </div>

        {/* Lista de autores */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-stone-100 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📖</p>
            <p className="text-stone-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              No hay autores registrados aún.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {authors.map((author: Author) => (
              <div
                key={author.id}
                className="bg-white border border-stone-200 rounded-sm px-6 py-5 flex items-center gap-5 hover:border-stone-300 hover:shadow-sm transition-all group"
              >
                {/* Iniciales del autor */}
                <div className="w-12 h-12 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-amber-800" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {getInitials(author.name)}
                  </span>
                </div>

                {/* Info principal */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-base leading-snug truncate">{author.name}</h3>
                  <p className="text-xs text-stone-400 mt-0.5 truncate" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {author.email}
                    {author.nationality && <span className="ml-2 text-stone-300">·</span>}
                    {author.nationality && <span className="ml-2">{author.nationality}</span>}
                  </p>
                </div>

                {/* Libros count */}
                <div className="text-center px-4 border-l border-stone-100 hidden md:block">
                  <p className="text-2xl font-bold text-stone-900">{author._count?.books || 0}</p>
                  <p className="text-xs text-stone-400 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {author._count?.books === 1 ? 'libro' : 'libros'}
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/authors/${author.id}`}
                    className="text-xs px-4 py-2 border border-stone-200 text-stone-700 rounded-sm hover:bg-stone-50 transition-colors"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    Ver perfil
                  </Link>
                  <button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className="text-xs px-4 py-2 border border-red-100 text-red-500 rounded-sm hover:bg-red-50 transition-colors"
                    style={{ fontFamily: "system-ui, sans-serif" }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}