import { NextRequest, NextResponse } from 'next/server'

// export const dynamic = 'force-dynamic'
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON body
    const body = await req.json();
    console.log(body)
    // Access properties directly
    const { code, phone } = body;
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/apis/v1/nail/vouchers/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        phone,
      }),
    });

    if (!response.ok)
      return NextResponse.json({
        success: false,
        data: null,
      }, {
        status: response.status
      })
 
    const result = await response.json() as any;

    if (result) {
      return NextResponse.json({
        success: true,
        data: result,
      }, {
        status: response.status,
      })
    }

  } catch (error) {
    console.error(error)

    return NextResponse.json({
        success: false,
        message: 'Internal server error',
      } , {
        status: 500,
    })
  }
}