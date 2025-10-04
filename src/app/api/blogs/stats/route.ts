import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/index'
import { blogTable, userProfilesTable, commentsTable } from '@/db/schema'
import { eq, count, desc, sql } from 'drizzle-orm'
import { user as usersTable } from '@/db/authSchema'

export async function GET(request: NextRequest) {
  try {
    const [totalPosts, totalComments] = await Promise.all([
      db.select({ count: count() }).from(blogTable),
      db.select({ count: count() }).from(commentsTable),
    ])

    const recentPostsRaw = await db
      .select({
        id: blogTable.id,
        title: blogTable.title,
        content: blogTable.content,
        tags: blogTable.tags,
        authorId: blogTable.authorId,
        createdAt: blogTable.createdAt,
        updatedAt: blogTable.updatedAt,
        authorEmail: usersTable.email,
        firstName: userProfilesTable.firstName,
        lastName: userProfilesTable.lastName,
        avatar: userProfilesTable.avatar,
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .orderBy(desc(blogTable.createdAt))
      .limit(5)

    // Format recent posts to match Blog interface
    const recentPosts = recentPostsRaw.map((post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      tags: post.tags || [],
      authorId: post.authorId,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.authorId,
        email: post.authorEmail || '',
        name:
          post.firstName && post.lastName
            ? `${post.firstName} ${post.lastName}`
            : post.authorEmail || 'Unknown',
        avatar: post.avatar || '',
      },
    }))

    const authorStats = await db
      .select({
        authorId: blogTable.authorId,
        authorEmail: usersTable.email,
        firstName: userProfilesTable.firstName,
        lastName: userProfilesTable.lastName,
        avatar: userProfilesTable.avatar,
        postCount: count(blogTable.id),
      })
      .from(blogTable)
      .leftJoin(usersTable, eq(blogTable.authorId, usersTable.id))
      .leftJoin(userProfilesTable, eq(usersTable.id, userProfilesTable.userId))
      .groupBy(
        blogTable.authorId,
        usersTable.email,
        userProfilesTable.firstName,
        userProfilesTable.lastName,
        userProfilesTable.avatar
      )
      .orderBy(desc(count(blogTable.id)))

    const tagStats = await db
      .select({
        tag: sql<string>`unnest(${blogTable.tags})`,
        count: count(blogTable.id),
      })
      .from(blogTable)
      .groupBy(sql`unnest(${blogTable.tags})`)
      .orderBy(desc(count(blogTable.id)))

    const stats = {
      totalPosts: totalPosts[0]?.count || 0,
      totalComments: totalComments[0]?.count || 0,
      averageCommentsPerPost: totalPosts[0]?.count
        ? Math.round((totalComments[0]?.count || 0) / totalPosts[0]?.count)
        : 0,
      recentPosts: recentPosts,
      authorStats: authorStats,
      tagStats: tagStats,
    }

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Error fetching blog stats:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog statistics' },
      { status: 500 }
    )
  }
}
