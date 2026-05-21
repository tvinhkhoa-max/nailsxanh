import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const tagCollection = searchParams.get('collection');
    const nails = await prisma.nail_nails.findMany({
      where: {
        relationshipCollection: {
          tag: tagCollection,
        },
        status: 1,
      },
      include: {
        relationshipCollection: true,
      },
      orderBy: { created_at: 'desc' },
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