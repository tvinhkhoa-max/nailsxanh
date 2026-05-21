import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '8';
    const hot = Boolean(searchParams.get('hot'));
    const tagCategory = searchParams.get('category');
    const collections = await prisma.nail_collections.findMany({
      where: {
        status: 1,
        hot: hot || undefined,
        relationshipCate: {
          tag: tagCategory || undefined
        }
      },
      include: {
        relationshipCate: true,
      },
      orderBy: { created_at: 'desc' },
      take: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
    })

    return NextResponse.json({
      success: true,
      data: collections,
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