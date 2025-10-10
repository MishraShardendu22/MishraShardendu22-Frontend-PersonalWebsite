import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const targets = [process.env.BACKEND_1, process.env.BACKEND_2, process.env.BACKEND_3].filter(
      Boolean
    ) as string[]

    if (targets.length === 0) {
      return NextResponse.json({ error: 'No backend targets configured' }, { status: 500 })
    }

    // Get the Authorization header from the request
    const authHeader = req.headers.get('Authorization')

    const backendUrl = `${targets[0]}/api/admin/auth`
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const responseData = await response.text()
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'X-Proxy-Backend': targets[0],
      },
    })
  } catch (error) {
    console.error('[Admin Auth Proxy GET] Error:', error)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const targets = [process.env.BACKEND_1, process.env.BACKEND_2, process.env.BACKEND_3].filter(
      Boolean
    ) as string[]

    if (targets.length === 0) {
      return NextResponse.json({ error: 'No backend targets configured' }, { status: 500 })
    }

    const backendUrl = `${targets[0]}/api/admin/auth`
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      await response.text()
    }
    const responseData = await response.text()
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
        'X-Proxy-Backend': targets[0],
      },
    })
  } catch (error) {
    console.error('[Admin Auth Proxy] Error:', error)
    return NextResponse.json({ error: 'Proxy error' }, { status: 500 })
  }
}
