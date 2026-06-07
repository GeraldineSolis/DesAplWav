import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const authorExists = await prisma.author.findUnique({ where: { id } })
    if (!authorExists) {
      return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 })
    }

    const books = await prisma.book.findMany({
      where: { authorId: id },
      orderBy: { publishedYear: 'asc' }
    })

    if (books.length === 0) {
      return NextResponse.json({
        totalBooks: 0,
        firstBookYear: null,
        lastBookYear: null,
        avgPages: 0,
        uniqueGenres: [],
        mostPagesBook: null,
        leastPagesBook: null
      })
    }

    const totalBooks = books.length
    const firstBookYear = books[0].publishedYear
    const lastBookYear = books[books.length - 1].publishedYear

    const totalPages = books.reduce((acc: number, book) => acc + (book.pages || 0), 0)
    const avgPages = Math.round(totalPages / totalBooks)

    const uniqueGenres = Array.from(new Set(books.map(b => b.genre).filter(Boolean)))

    let mostPagesBook = books[0]
    let leastPagesBook = books[0]

    books.forEach((book) => {
      const currentPages = book.pages || 0
      const mostPages = mostPagesBook.pages || 0
      const leastPages = leastPagesBook.pages || 0

      if (currentPages > mostPages) mostPagesBook = book
      if (currentPages < leastPages) leastPagesBook = book
    })

    return NextResponse.json({
      totalBooks,
      firstBookYear,
      lastBookYear,
      avgPages,
      uniqueGenres,
      mostPagesBook,
      leastPagesBook
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al calcular estadísticas del autor' },
      { status: 500 }
    )
  }
}