import { NextRequest, NextResponse } from 'next/server'
import { checkAllBackendsHealth } from '@/lib/health-check-server'

export async function GET(req: NextRequest) {
  try {
    const backendHealths = await checkAllBackendsHealth()

    const overallHealth =
      backendHealths.length > 0 && backendHealths.some((b) => b.status === 'healthy')
        ? 'healthy'
        : 'unhealthy'

    return NextResponse.json({
      status: overallHealth,
      timestamp: new Date().toISOString(),
      backends: backendHealths,
      summary: {
        total: backendHealths.length,
        healthy: backendHealths.filter((b) => b.status === 'healthy').length,
        unhealthy: backendHealths.filter((b) => b.status === 'unhealthy').length,
        timeout: backendHealths.filter((b) => b.status === 'timeout').length,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error.message || 'Health check failed',
        backends: [],
      },
      { status: 500 }
    )
  }
}
