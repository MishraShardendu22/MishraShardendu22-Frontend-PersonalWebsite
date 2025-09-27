import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { blogRevisionsTable, blogTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; version: string }> }
) {
  try {
    const blogId = parseInt((await params).id)
    const version = parseInt((await params).version)

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    if (isNaN(version)) {
      return NextResponse.json({ success: false, error: 'Invalid version number' }, { status: 400 })
    }

    const blog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (blog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }
    const revision = await db
      .select({
        id: blogRevisionsTable.id,
        blogId: blogRevisionsTable.blogId,
        title: blogRevisionsTable.title,
        content: blogRevisionsTable.content,
        tags: blogRevisionsTable.tags,
        version: blogRevisionsTable.version,
        createdAt: blogRevisionsTable.createdAt,
      })
      .from(blogRevisionsTable)
      .where(and(eq(blogRevisionsTable.blogId, blogId), eq(blogRevisionsTable.version, version)))
      .limit(1)

    if (revision.length === 0) {
      return NextResponse.json({ success: false, error: 'Revision not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: revision[0],
    })
  } catch (error) {
    console.error('Error fetching revision:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch revision' }, { status: 500 })
  }
}
