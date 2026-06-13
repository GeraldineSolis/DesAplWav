'use client'
import { FormEvent, useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'

type BookSummary = {
  id: string
  title: string
  isbn?: string
  pages?: number
  publishedYear?: number
  genre?: string
}

type AuthorDetail = {
  id: string
  name: string
  email?: string
  bio?: string
  nationality?: string
  books?: BookSummary[]
}

type AuthorStats = {
  totalBooks?: number
  firstBookYear?: number
  lastBookYear?: number
  avgPages?: number
  uniqueGenres?: string[]
  mostPagesBook?: {
    title: string
    pages?: number
  }
  leastPagesBook?: {
    title: string
    pages?: number
  }
}

export default function AuthorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [author, setAuthor] = useState<AuthorDetail | null>(null)
  const [stats, setStats] = useState<AuthorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [nationality, setNationality] = useState('')

  const loadData = async () => {
    setLoading(true)
    const [resAuthor, resStats] = await Promise.all([
      fetch(`/api/authors/${id}`),
      fetch(`/api/authors/${id}/stats`)
    ])
    if (resAuthor.ok && resStats.ok) {
      const dataAuthor = await resAuthor.json()
      const dataStats = await resStats.json()
      setAuthor(dataAuthor)
      setStats(dataStats)
      setName(dataAuthor.name)
      setBio(dataAuthor.bio || '')
      setNationality(dataAuthor.nationality || '')
    }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [id])

  const handleUpdateAuthor = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch(`/api/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, bio, nationality })
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      setEditing(false)
      loadData()
    }
  }

  const getInitials = (n: string) => n.split(' ').map(x => x[0]).slice(0, 2).join('').toUpperCase()

  if (loading) return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="space-y-3 text-center">
        <div className="w-16 h-16 rounded-sm bg-stone-100 animate-pulse mx-auto" />
        <p className="text-stone-400 text-sm">Cargando perfil...</p>
      </div>
    </div>
  )

  if (!author) return (
    <div className="min-h-screen bg-[#FAF8F4] flex items-center justify-center" style={{ fontFamily: "system-ui, sans-serif" }}>
      <p className="text-stone-500">Autor no encontrado.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Header */}
      <header className="border-b border-stone-200 bg-[#FAF8F4]">
        <div className="max-w-5xl mx-auto px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            ← Todos los autores
          </button>
          {saved && (
            <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              ✓ Cambios guardados
            </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-8 py-12 space-y-10">

        {/* Perfil del autor */}
        <div className="flex items-start gap-8">
          {/* Avatar grande */}
          <div className="w-24 h-24 rounded-sm bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-amber-800" style={{ fontFamily: "system-ui, sans-serif" }}>
              {getInitials(author.name)}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest uppercase text-amber-700 mb-1" style={{ fontFamily: "system-ui, sans-serif" }}>
                  Perfil de autor
                </p>
                <h1 className="text-4xl font-bold text-stone-900 leading-tight">{author.name}</h1>
                <p className="text-stone-400 mt-1 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                  {author.email}
                  {author.nationality && <span className="ml-2">· {author.nationality}</span>}
                </p>
              </div>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs px-4 py-2 border border-stone-200 text-stone-600 rounded-sm hover:bg-stone-50 transition-colors flex-shrink-0"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {editing ? '✕ Cancelar' : '✎ Editar perfil'}
              </button>
            </div>
            {author.bio && !editing && (
              <p className="text-stone-600 mt-4 italic leading-relaxed text-sm border-l-2 border-amber-200 pl-4">
                "{author.bio}"
              </p>
            )}
          </div>
        </div>

        {/* Formulario de edición */}
        {editing && (
          <div className="bg-white border border-stone-200 rounded-sm p-8 shadow-sm">
            <h3 className="text-base font-bold text-stone-800 mb-5">Editar información del autor</h3>
            <form onSubmit={handleUpdateAuthor}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Nombre</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Nacionalidad</label>
                  <input type="text" value={nationality} onChange={e => setNationality(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Biografía</label>
                  <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm resize-none"
                    style={{ fontFamily: "system-ui, sans-serif" }} />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setEditing(false)}
                  className="px-5 py-2.5 text-sm text-stone-600 border border-stone-200 rounded-sm hover:bg-stone-50"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  Cancelar
                </button>
                <button type="submit"
                  className="px-6 py-2.5 text-sm bg-stone-900 text-amber-50 rounded-sm hover:bg-stone-800 transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Divisor */}
        <div className="flex items-center gap-4">
          <div className="h-px bg-stone-200 flex-1" />
          <span className="text-stone-300 text-xs tracking-widest" style={{ fontFamily: "system-ui, sans-serif" }}>◆</span>
          <div className="h-px bg-stone-200 flex-1" />
        </div>

        {/* Métricas */}
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
            Métricas del autor
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-stone-200 rounded-sm p-5 text-center">
              <p className="text-3xl font-bold text-stone-900">{stats?.totalBooks || 0}</p>
              <p className="text-xs text-stone-400 mt-1 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>libros publicados</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-sm p-5 text-center">
              <p className="text-lg font-bold text-stone-900">
                {stats?.firstBookYear && stats?.lastBookYear
                  ? `${stats.firstBookYear}–${stats.lastBookYear}`
                  : '—'}
              </p>
              <p className="text-xs text-stone-400 mt-1 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>rango de años</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-sm p-5 text-center">
              <p className="text-3xl font-bold text-stone-900">{stats?.avgPages || 0}</p>
              <p className="text-xs text-stone-400 mt-1 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>páginas promedio</p>
            </div>
            <div className="bg-white border border-stone-200 rounded-sm p-5 text-center">
              <p className="text-lg font-bold text-stone-900 truncate px-1">
                {stats?.uniqueGenres?.length ? stats.uniqueGenres!.length : '—'}
              </p>
              <p className="text-xs text-stone-400 mt-1 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>géneros únicos</p>
            </div>
          </div>

          {/* Libros destacados */}
          {(stats?.totalBooks ?? 0) > 0 && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {stats?.mostPagesBook && (
                <div className="bg-amber-50 border border-amber-100 rounded-sm px-5 py-4 flex items-center gap-3">
                  <span className="text-amber-400 text-lg">📈</span>
                  <div>
                    <p className="text-xs text-amber-600 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>Más extenso</p>
                    <p className="text-sm font-bold text-stone-800">{stats.mostPagesBook.title}</p>
                    <p className="text-xs text-stone-400" style={{ fontFamily: "system-ui, sans-serif" }}>{stats.mostPagesBook.pages} páginas</p>
                  </div>
                </div>
              )}
              {stats?.leastPagesBook && (
                <div className="bg-stone-50 border border-stone-200 rounded-sm px-5 py-4 flex items-center gap-3">
                  <span className="text-stone-400 text-lg">📉</span>
                  <div>
                    <p className="text-xs text-stone-400 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>Más corto</p>
                    <p className="text-sm font-bold text-stone-800">{stats.leastPagesBook.title}</p>
                    <p className="text-xs text-stone-400" style={{ fontFamily: "system-ui, sans-serif" }}>{stats.leastPagesBook.pages} páginas</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Obras del autor */}
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-4" style={{ fontFamily: "system-ui, sans-serif" }}>
            Obras del autor
          </p>
          {author?.books?.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-stone-200 rounded-sm">
              <p className="text-stone-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
                Este autor aún no tiene libros registrados.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {author.books?.map((book: BookSummary, idx: number) => (
                <div key={book.id}
                  className="bg-white border border-stone-200 rounded-sm px-6 py-4 flex items-center gap-5 hover:border-stone-300 transition-all">
                  <span className="text-xs text-stone-300 w-5 text-center flex-shrink-0" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {idx + 1}
                  </span>
                  <div className="w-px h-8 bg-stone-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 leading-snug truncate">{book.title}</h4>
                    <p className="text-xs text-stone-400 mt-0.5" style={{ fontFamily: "system-ui, sans-serif" }}>
                      ISBN: {book.isbn || 'Sin código'} · {book.pages} pág. · {book.publishedYear}
                    </p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-stone-50 text-stone-600 border border-stone-100 rounded-sm flex-shrink-0"
                    style={{ fontFamily: "system-ui, sans-serif" }}>
                    {book.genre}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}