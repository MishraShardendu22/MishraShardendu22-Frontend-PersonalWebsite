
import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './authSchema'

export const userProfilesTable = pgTable('user_profiles', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  bio: text('bio'),
  avatar: varchar('avatar', { length: 500 }),
  website: varchar('website', { length: 255 }),
  location: varchar('location', { length: 100 }),
  dateOfBirth: timestamp('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
