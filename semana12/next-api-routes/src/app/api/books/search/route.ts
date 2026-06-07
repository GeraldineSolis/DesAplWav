import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre') || ''
    const authorName = searchParams.get('authorName') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')))
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') === 'asc' ? 'asc' : 'desc'

    const allowedSortFields = ['title', 'publishedYear', 'createdAt']
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'

    const whereClause: any = {
      AND: [
        search ? { title: { contains: search, mode: 'insensitive' } } : {},
        genre ? { genre: { equals: genre } } : {},
        authorName ? {
          author: {
            name: { contains: authorName, mode: 'insensitive' }
          }
        } : {}
      ]
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where: whereClause,
        include: { author: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [finalSortBy]: order }
      }),
      prisma.book.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error al buscar libros avanzadamente' },
      { status: 500 }
    )
  }
}