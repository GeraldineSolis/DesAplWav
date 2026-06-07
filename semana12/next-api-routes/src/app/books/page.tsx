'use client'
import { FormEvent, useEffect, useState } from 'react'

type Author = {
  id: string
  name: string
}

type Book = {
  id: string
  title: string
  genre?: string
  pages?: number
  publishedYear?: number
  author?: {
    id: string
    name: string
  }
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const initialPagination: Pagination = {
  page: 1,
  limit: 8,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
}

export default function BookSearchPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<Pagination>(initialPagination)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [isbn, setIsbn] = useState('')
  const [pubYear, setPubYear] = useState('')
  const [bookGenre, setBookGenre] = useState('')
  const [pages, setPages] = useState('')
  const [selectedAuthorId, setSelectedAuthorId] = useState('')

  useEffect(() => {
    fetch('/api/authors')
      .then(res => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAuthors(data)
        }
      })
      .catch(() => {
        setAuthors([])
      })
  }, [])

  const executeSearch = async () => {
    setLoading(true)
    setError(null)

    try {
      const query = new URLSearchParams({
        search,
        genre,
        authorName,
        sortBy,
        order,
        page: page.toString(),
        limit: initialPagination.limit.toString(),
      })

      const res = await fetch(`/api/books/search?${query.toString()}`)
      if (!res.ok) {
        throw new Error('Error al cargar libros')
      }

      const data = await res.json()
      setBooks(Array.isArray(data?.data) ? data.data : [])
      setPagination(
        data?.pagination && typeof data.pagination === 'object'
          ? data.pagination
          : initialPagination
      )
    } catch (err) {
      console.error(err)
      setBooks([])
      setPagination(initialPagination)
      setError('No se pudieron cargar los libros. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { executeSearch() }, [search, genre, authorName, sortBy, order, page])

  const handleCreateBook = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description: desc,
        isbn,
        publishedYear: pubYear ? parseInt(pubYear, 10) : null,
        genre: bookGenre,
        pages: pages ? parseInt(pages, 10) : null,
        authorId: selectedAuthorId,
      })
    })
    if (res.ok) {
      setTitle(''); setDesc(''); setIsbn(''); setPubYear(''); setBookGenre(''); setPages(''); setSelectedAuthorId('')
      setFormOpen(false)
      executeSearch()
    } else { alert('Error al registrar libro') }
  }

  const handleDeleteBook = async (id: string) => {
    if (!confirm('¿Eliminar este libro?')) return
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' })
    if (res.ok) executeSearch()
  }

  const genreColors: Record<string, string> = {
    'Ficción': 'bg-purple-50 text-purple-700 border-purple-100',
    'No ficción': 'bg-blue-50 text-blue-700 border-blue-100',
    'Ciencia': 'bg-teal-50 text-teal-700 border-teal-100',
    'Historia': 'bg-amber-50 text-amber-700 border-amber-100',
    'Poesía': 'bg-pink-50 text-pink-700 border-pink-100',
  }
  const getGenreClass = (g?: string) => genreColors[g ?? ''] || 'bg-stone-50 text-stone-600 border-stone-200'

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* Header */}
      <header className="border-b border-stone-200 bg-[#FAF8F4]">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xs tracking-widest uppercase text-stone-400 hover:text-stone-600 transition-colors"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              ← Autores
            </a>
            <span className="text-stone-200">|</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-stone-900">Catálogo de Libros</h1>
              <p className="text-xs text-stone-400 tracking-widest uppercase" style={{ fontFamily: "system-ui, sans-serif" }}>
                Explorador y registro
              </p>
            </div>
          </div>
          <button
            onClick={() => setFormOpen(!formOpen)}
            className="text-sm px-5 py-2.5 bg-stone-900 text-amber-50 rounded-sm hover:bg-stone-800 transition-colors"
            style={{ fontFamily: "system-ui, sans-serif" }}
          >
            {formOpen ? '✕ Cancelar' : '＋ Agregar libro'}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10 space-y-8">

        {/* Formulario */}
        {formOpen && (
          <div className="bg-white border border-stone-200 rounded-sm p-8 shadow-sm">
            <h3 className="text-lg font-bold text-stone-800 mb-6">Registrar nuevo libro</h3>
            <form onSubmit={handleCreateBook}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Título *</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} placeholder="Título completo del libro" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Autor *</label>
                  <select value={selectedAuthorId} onChange={e => setSelectedAuthorId(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }}>
                    <option value="">— Seleccionar autor —</option>
                    {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Género *</label>
                  <input type="text" value={bookGenre} onChange={e => setBookGenre(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} placeholder="Ej. Ficción, Historia..." />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Páginas *</label>
                  <input type="number" value={pages} onChange={e => setPages(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} placeholder="320" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Año publicación *</label>
                  <input type="number" value={pubYear} onChange={e => setPubYear(e.target.value)} required
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} placeholder="1985" />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>ISBN</label>
                  <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm"
                    style={{ fontFamily: "system-ui, sans-serif" }} placeholder="978-0-000-00000-0" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-1.5" style={{ fontFamily: "system-ui, sans-serif" }}>Sinopsis</label>
                  <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2}
                    className="w-full px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 bg-stone-50 focus:outline-none focus:border-stone-400 text-sm resize-none"
                    style={{ fontFamily: "system-ui, sans-serif" }} placeholder="Breve descripción del libro..." />
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setFormOpen(false)}
                  className="px-5 py-2.5 text-sm text-stone-600 border border-stone-200 rounded-sm hover:bg-stone-50"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  Cancelar
                </button>
                <button type="submit"
                  className="px-6 py-2.5 text-sm bg-stone-900 text-amber-50 rounded-sm hover:bg-stone-800 transition-colors"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  Registrar libro
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white border border-stone-200 rounded-sm p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 text-sm">🔍</span>
              <input type="text" placeholder="Buscar por título..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 focus:outline-none focus:border-stone-400 text-sm bg-stone-50"
                style={{ fontFamily: "system-ui, sans-serif" }} />
            </div>
            <input type="text" placeholder="Filtrar por género..."
              value={genre} onChange={e => { setGenre(e.target.value); setPage(1) }}
              className="px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 focus:outline-none focus:border-stone-400 text-sm bg-stone-50"
              style={{ fontFamily: "system-ui, sans-serif" }} />
            <input type="text" placeholder="Nombre del autor..."
              value={authorName} onChange={e => { setAuthorName(e.target.value); setPage(1) }}
              className="px-4 py-2.5 border border-stone-200 rounded-sm text-stone-900 focus:outline-none focus:border-stone-400 text-sm bg-stone-50"
              style={{ fontFamily: "system-ui, sans-serif" }} />
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-3">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-sm text-stone-600 text-xs bg-stone-50 focus:outline-none"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                <option value="createdAt">Más recientes</option>
                <option value="title">Título A–Z</option>
                <option value="publishedYear">Año publicación</option>
              </select>
              <select value={order} onChange={e => setOrder(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-sm text-stone-600 text-xs bg-stone-50 focus:outline-none"
                style={{ fontFamily: "system-ui, sans-serif" }}>
                <option value="desc">↓ Descendente</option>
                <option value="asc">↑ Ascendente</option>
              </select>
            </div>
            <span className="text-xs text-stone-400" style={{ fontFamily: "system-ui, sans-serif" }}>
              {pagination.total || 0} resultado{pagination.total !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Lista de libros */}
        {error && (
          <div className="rounded-sm border border-red-100 bg-red-50 px-5 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-stone-100 rounded-sm animate-pulse" />
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-stone-200 rounded-sm">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-stone-400 text-sm" style={{ fontFamily: "system-ui, sans-serif" }}>
              No se encontraron libros con estos criterios.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {books.map((book) => (
              <div key={book.id}
                className="bg-white border border-stone-200 rounded-sm px-6 py-4 flex items-center gap-5 hover:border-stone-300 hover:shadow-sm transition-all">
                {/* Año como elemento decorativo */}
                <div className="w-14 text-center flex-shrink-0 hidden sm:block">
                  <span className="text-xs font-bold text-stone-300 tracking-wide" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {book.publishedYear}
                  </span>
                </div>
                <div className="w-px h-10 bg-stone-100 hidden sm:block flex-shrink-0" />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-stone-900 leading-snug truncate">{book.title}</h3>
                  <p className="text-xs text-stone-400 mt-0.5 truncate" style={{ fontFamily: "system-ui, sans-serif" }}>
                    {book.author?.name ?? 'Autor desconocido'} · {book.pages ?? '—'} páginas
                  </p>
                </div>
                {/* Género */}
                <span className={`text-xs px-3 py-1 border rounded-sm font-medium flex-shrink-0 hidden md:inline ${getGenreClass(book.genre)}`}
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  {book.genre}
                </span>
                {/* Eliminar */}
                <button onClick={() => handleDeleteBook(book.id)}
                  className="text-xs px-3 py-1.5 border border-red-100 text-red-400 rounded-sm hover:bg-red-50 transition-colors flex-shrink-0"
                  style={{ fontFamily: "system-ui, sans-serif" }}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <button disabled={!pagination.hasPrev} onClick={() => setPage(p => p - 1)}
              className="text-sm px-5 py-2.5 border border-stone-200 rounded-sm text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              ← Anterior
            </button>
            <span className="text-xs text-stone-400 tracking-widest" style={{ fontFamily: "system-ui, sans-serif" }}>
              {pagination.page} / {pagination.totalPages}
            </span>
            <button disabled={!pagination.hasNext} onClick={() => setPage(p => p + 1)}
              className="text-sm px-5 py-2.5 border border-stone-200 rounded-sm text-stone-600 hover:bg-stone-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: "system-ui, sans-serif" }}>
              Siguiente →
            </button>
          </div>
        )}
      </main>
    </div>
  )
}