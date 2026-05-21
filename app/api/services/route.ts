import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // const searchParams = req.nextUrl.searchParams;
    const nails = await prisma.nail_services.findMany({
      where: {
        status: 1,
      },
      orderBy: [
        { type: 'asc' },
        { created_at: 'asc' }
      ],
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