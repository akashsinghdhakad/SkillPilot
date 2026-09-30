# Migrate from Firebase to Supabase

The goal of this task is to completely migrate the backend architecture from Firebase (Auth + Firestore) to Supabase (Auth + PostgreSQL).

## User Review Required

> [!WARNING]
> Migrating to Supabase is a massive structural change. We will replace NoSQL Document structures with Relational Database Tables, and transition from Firebase SDK to Supabase SDK (`@supabase/supabase-js`, `@supabase/ssr`).
> Before proceeding, please review the proposed SQL schema below. If you already have a Supabase project created, we will need the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` later during execution.

## Proposed Changes

### 1. Dependency Management
- **[NEW]** Add `@supabase/supabase-js` and `@supabase/ssr` to `package.json`.
- **[DELETE]** Remove `firebase` from `package.json`.

### 2. Supabase SQL Schema Design

Firestore's `user_profiles`, `chats`, `channels`, and `messages` (with subcollections) will be migrated to the following PostgreSQL tables. We will also utilize Supabase's Row Level Security (RLS).

```sql
-- Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  profile_picture_url TEXT,
  role TEXT CHECK (role IN ('Admin', 'Moderator', 'Member')) DEFAULT 'Member',
  headline TEXT,
  bio TEXT,
  skills TEXT[],
  linkedin_url TEXT,
  github_url TEXT,
  twitter_url TEXT,
  total_engagement_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Channels
CREATE TABLE channels (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_announcement BOOLEAN DEFAULT FALSE,
  read_only BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,
  last_message_text TEXT,
  last_message_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE channel_members (
  channel_id TEXT REFERENCES channels(id),
  user_id UUID REFERENCES user_profiles(id),
  join_date TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);

-- Chats (DMs)
CREATE TABLE chats (
  id TEXT PRIMARY KEY,
  is_group BOOLEAN DEFAULT FALSE,
  last_message_text TEXT,
  last_message_timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_members (
  chat_id TEXT REFERENCES chats(id),
  user_id UUID REFERENCES user_profiles(id),
  PRIMARY KEY (chat_id, user_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id TEXT, -- Can be channel_id or chat_id depending on context
  is_channel BOOLEAN DEFAULT FALSE,
  sender_id UUID REFERENCES user_profiles(id),
  text TEXT,
  thread_id UUID,
  is_poll BOOLEAN DEFAULT FALSE,
  poll_question TEXT,
  poll_allow_multiple BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Emulate Message Reactions & Polls
CREATE TABLE message_reactions (
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES user_profiles(id),
  emoji TEXT NOT NULL,
  PRIMARY KEY (message_id, user_id, emoji)
);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(id),
  text TEXT NOT NULL
);

CREATE TABLE poll_votes (
  poll_option_id UUID REFERENCES poll_options(id),
  user_id UUID REFERENCES user_profiles(id),
  PRIMARY KEY (poll_option_id, user_id)
);
```

---

### 3. Core Data Access Logic

#### [DELETE] `src/firebase/*`
All files inside `src/firebase` (such as `users.ts`, `chat.ts`, `auth.ts`, `provider.tsx`, etc.) will be removed and systematically replaced.

#### [NEW] `src/supabase/client.ts`
Initialize and export the Supabase client using `@supabase/ssr`.

#### [NEW] `src/supabase/provider.tsx`
Create a `SupabaseProvider` that manages auth state (`onAuthStateChange`) and provides the session to the component tree.

#### [NEW] `src/supabase/users.ts`
Implement `updateUserRole` and `updateUserProfile` using `supabase.from('user_profiles')`.

#### [NEW] `src/supabase/chat.ts`
Implement `findOrCreateChat`, `createChannel`, `sendMessage`, `toggleReaction`, and `voteInPoll`, utilizing Supabase `.insert()`, `.select()`, and specific PostgreSQL RPCs if atomic transactions are required.

### 4. Components Refactoring
#### [MODIFY] Various UI Components
Search for all instances of `import ... from '@/firebase/...'` or Firebase collection hooks (`useCollection`, `useDoc`).
- Convert real-time Firestore listeners into Supabase Realtime subscriptions (`supabase.channel('public:messages').on('postgres_changes', ...)`).
- Update forms to process `@supabase/supabase-js` auth methods instead of Firebase Auth.

---

## Open Questions

1. **Current Data Migration:** Since we are moving to a relational SQL structure, do we need to migrate the existing Firestore data, or is starting with a clean slate acceptable? (Starting fresh is recommended for a smooth NoSQL -> SQL transition).

> [!IMPORTANT]
> If you approve the plan and have decided on the data migration approach, just say "Proceed" and we will begin execution by starting your local Supabase instance!

## Verification Plan

### Automated/Manual Verification
- Execute the SQL Schema in the Supabase SQL editor.
- Restart the development server (`npm run dev`).
- Ensure signing up creates a row in `auth.users` and a trigger-generated or code-inserted row in `user_profiles`.
- Test real-time changes by sending a message in a channel and ensuring it appears without refreshing.
