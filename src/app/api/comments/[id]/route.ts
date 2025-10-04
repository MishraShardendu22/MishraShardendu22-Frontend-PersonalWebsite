import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { commentsTable } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { user as usersTable } from '@/db/authSchema'

const OWNER_EMAIL = 'mishrashardendu22@gmail.com'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const commentId = parseInt((await params).id)
    const body = await request.json()

    const { content } = body

    if (isNaN(commentId)) {
      return NextResponse.json({ success: false, error: 'Invalid comment ID' }, { status: 400 })
    }

    await db.update(commentsTable).set({ content }).where(eq(commentsTable.id, commentId))

    const updatedComment = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.id, commentId))
      .limit(1)

    if (updatedComment.length === 0) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedComment[0],
    })
  } catch (error) {
    console.error('Error updating comment:', error)
    return NextResponse.json({ success: false, error: 'Failed to update comment' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const commentId = parseInt((await params).id)

    if (isNaN(commentId)) {
      return NextResponse.json({ success: false, error: 'Invalid comment ID' }, { status: 400 })
    }

    const session = await auth.api.getSession({ headers: request.headers })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const existingComment = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.id, commentId))
      .limit(1)

    if (existingComment.length === 0) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 })
    }

    // Allow deletion if user is the comment owner OR the blog owner (mishrashardendu22@gmail.com)
    const isCommentOwner = existingComment[0].userId === session.user.id
    const isBlogOwner = session.user.email === OWNER_EMAIL

    if (!isCommentOwner && !isBlogOwner) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You can only delete your own comments' },
        { status: 403 }
      )
    }

    await db.delete(commentsTable).where(eq(commentsTable.id, commentId))

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 })
  }
}
