import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { blogTable, userProfilesTable, commentsTable } from '@/db/schema'
import { eq, count } from 'drizzle-orm'
import { user as usersTable } from '@/db/authSchema'
import { auth } from '@/lib/auth'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const blogId = parseInt((await params).id)

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    const blog = await db
      .select({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
        author: {
          id: usersTable.id,
          email: usersTable.email,
          avatar: usersTable.image,
          name: usersTable.name,
        },
        authorProfile: {
          firstName: userProfilesTable.firstName,
          lastName: userProfilesTable.lastName,
          avatar: userProfilesTable.avatar,
        },
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .where(eq(blogTable.id, blogId))
      .limit(1)

    if (blog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    const [commentsCount] = await Promise.all([
      db.select({ count: count() }).from(commentsTable).where(eq(commentsTable.blogId, blogId)),
    ])

    const blogWithCounts = {
      ...blog[0],
      comments: commentsCount[0]?.count || 0,
    }

    return NextResponse.json({
      success: true,
      data: blogWithCounts,
    })
  } catch (error) {
    console.error('Error fetching blog:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const blogId = parseInt((await params).id)
    const body = await request.json()
    const { title, content, tags } = body

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Only allow owner to update blogs
    if (session.user.email !== OWNER_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only the owner can update blog posts' },
        { status: 403 }
      )
    }

    const existingBlog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (existingBlog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    const [updatedBlog] = await db
      .update(blogTable)
      .set({
        title: title || existingBlog[0].title,
        content: content || existingBlog[0].content,
        tags: tags || existingBlog[0].tags,
        updatedAt: new Date(),
      })
      .where(eq(blogTable.id, blogId))
      .returning({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
      })

    return NextResponse.json({
      success: true,
      data: updatedBlog,
    })
  } catch (error) {
    console.error('Error updating blog:', error)
    return NextResponse.json({ success: false, error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const blogId = parseInt((await params).id)

    if (isNaN(blogId)) {
      return NextResponse.json({ success: false, error: 'Invalid blog ID' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Only allow owner to delete blogs
    if (session.user.email !== OWNER_EMAIL) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Only the owner can delete blog posts' },
        { status: 403 }
      )
    }

    const existingBlog = await db.select().from(blogTable).where(eq(blogTable.id, blogId)).limit(1)

    if (existingBlog.length === 0) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    await db.delete(blogTable).where(eq(blogTable.id, blogId))

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting blog:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete blog' }, { status: 500 })
  }
}
