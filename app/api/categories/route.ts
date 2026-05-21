import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const cates = await prisma.nail_cates.findMany({
      where: { status: 1 },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({
      success: true,
      data: cates,
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