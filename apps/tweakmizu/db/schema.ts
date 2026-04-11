import { boolean, integer, json, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  createdAt: timestamp('createdAt').notNull(),
  modifiedAt: timestamp('modifiedAt'),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  recurringInterval: text('recurringInterval').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: timestamp('currentPeriodStart').notNull(),
  currentPeriodEnd: timestamp('currentPeriodEnd').notNull(),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull().default(false),
  canceledAt: timestamp('canceledAt'),
  startedAt: timestamp('startedAt').notNull(),
  endsAt: timestamp('endsAt'),
  endedAt: timestamp('endedAt'),
  customerId: text('customerId').notNull(),
  productId: text('productId').notNull(),
  discountId: text('discountId'),
  checkoutId: text('checkoutId').notNull(),
  customerCancellationReason: text('customerCancellationReason'),
  customerCancellationComment: text('customerCancellationComment'),
  metadata: text('metadata'),
  customFieldData: text('customFieldData'),
  userId: text('userId').references(() => user.id),
});

export const generatedProject = pgTable('generated_project', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  teamId: text('team_id').references(() => team.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  industry: text('industry').notNull(),
  stack: text('stack').notNull(),
  intent: json('intent').notNull(),
  plan: json('plan').notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const team = pgTable('team', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const teamMember = pgTable('team_member', {
  id: text('id').primaryKey(),
  teamId: text('team_id')
    .notNull()
    .references(() => team.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull().$type<'owner' | 'admin' | 'member'>(),
  joinedAt: timestamp('joined_at').notNull(),
});

export const teamInvite = pgTable('team_invite', {
  id: text('id').primaryKey(),
  teamId: text('team_id')
    .notNull()
    .references(() => team.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: text('role').notNull().$type<'admin' | 'member'>(),
  invitedBy: text('invited_by')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').notNull(),
});

export const share = pgTable('share', {
  id: text('id').primaryKey(),
  token: text('token').notNull().unique(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  projectId: text('project_id').notNull(),
  planJson: json('plan_json').notNull(),
  expiresAt: timestamp('expires_at'),
  views: integer('views').notNull().default(0),
  createdAt: timestamp('created_at').notNull(),
});
