import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const hot = Boolean(searchParams.get('hot'));
    const page = Number(searchParams.get('page'));
    const limit = Number(searchParams.get('limit')) || 2;
    const nails = await prisma.nail_news.findMany({
      where: {
        status: 1,
        hot: hot || undefined,
      },
      orderBy: {
        created_at: 'desc'
      },
      take: limit,
      skip: (page - 1) * limit,
    })

    return NextResponse.json({
      success: true,
      data: nails,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      {
        status: 500,
      }
    )
  }
}