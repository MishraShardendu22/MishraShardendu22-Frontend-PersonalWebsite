import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  // Mock admin profile for now - you can implement real backend call later
  // For admin authentication, we just need to return a simple profile
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    if (!token) {
      return new Response(
        JSON.stringify({ error: 'No token provided' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Simple mock profile - replace with real backend call if needed
    const profile = {
      email: 'admin@example.com',
      role: 'admin',
      authenticated: true
    }

    return new Response(
      JSON.stringify(profile),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('[Admin Profile error]', err)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to load profile', 
        detail: err?.message || String(err) 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
