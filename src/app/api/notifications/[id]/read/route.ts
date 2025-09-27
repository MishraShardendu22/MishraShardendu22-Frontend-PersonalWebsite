import { db } from '@/index'
import { eq } from 'drizzle-orm'
import { notificationsTable } from '@/db/schema'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const notificationId = parseInt((await params).id)

    if (isNaN(notificationId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid notification ID' },
        { status: 400 }
      )
    }

    const existingNotification = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, notificationId))
      .limit(1)

    if (existingNotification.length === 0) {
      return NextResponse.json({ success: false, error: 'Notification not found' }, { status: 404 })
    }

    const [updatedNotification] = await db
      .update(notificationsTable)
      .set({
        isRead: 1,
      })
      .where(eq(notificationsTable.id, notificationId))
      .returning({
        id: notificationsTable.id,
        userId: notificationsTable.userId,
        type: notificationsTable.type,
        title: notificationsTable.title,
        message: notificationsTable.message,
        relatedId: notificationsTable.relatedId,
        isRead: notificationsTable.isRead,
        createdAt: notificationsTable.createdAt,
      })

    return NextResponse.json({
      success: true,
      data: updatedNotification,
    })
  } catch (error) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    )
  }
}
