import { NextResponse } from 'next/server'
import { prisma } from '@/src/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {
  const { id } = await params

  const nail = await prisma.nail_nails.findUnique({
    where: {
      id: id,
    },
  })

  return NextResponse.json({
    success: true,
    data: nail,
  })
}