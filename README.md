# Telegram
# Telegram Clone Web

A real-time web chat application inspired by Telegram, built with **Next.js**, **TypeScript**, and **Supabase**.

The initial goal of this project is to allow users to sign in with a Google, Microsoft, or Apple account, create a profile, add friends, and start real-time conversations.

---

## Technologies

* **Next.js** — React framework for modern web applications
* **TypeScript** — static typing
* **Tailwind CSS** — fast and consistent styling
* **Supabase Auth** — authentication with Google, Microsoft, and Apple
* **Supabase Postgres** — relational database
* **Supabase Realtime** — real-time messaging
* **Supabase Storage** — avatars and file uploads
* **Supabase Edge Functions** — secure serverless logic
* **Row Level Security** — database-level security

---

## MVP Goal

The initial MVP will include the following features:

* Authentication with Google
* User profile creation
* Username selection
* User search
* Friend request system
* Accepting or rejecting friend requests
* Direct conversation creation
* Sending and receiving real-time messages

Future features:

* Microsoft login
* Apple login
* Online user status
* “Typing...” indicator
* Read receipts
* Image and file uploads
* Push notifications
* Group chats
* Edited and deleted messages
* Message reactions

---

## Architecture

The application follows a serverless architecture powered by Supabase.

```txt
Browser
  ↓
Next.js App
  ↓
Supabase Client
  ↓
Supabase Auth + Postgres + Realtime + Storage
  ↓
Edge Functions for critical operations
```

The frontend communicates directly with Supabase using the `anon key`.
Security is enforced through **Row Level Security** in Postgres.

The `service_role key` must never be exposed in the frontend.

---

## Project Structure

```txt
src/
  app/
    auth/
      callback/
        route.ts
    login/
      page.tsx
    onboarding/
      page.tsx
    chat/
      page.tsx
    chat/
      [conversationId]/
        page.tsx

  components/
    chat/
      ChatList.tsx
      MessageList.tsx
      MessageInput.tsx
      UserSearch.tsx

  features/
    auth/
    chat/
    friends/
    profile/

  lib/
    supabase/
      client.ts
      server.ts
      middleware.ts

  types/
```

---

## Getting Started

### 1. Create the project

```bash
npx create-next-app@latest telegram-clone
cd telegram-clone
```

Recommended setup:

```txt
TypeScript: Yes
ESLint: Yes
Tailwind CSS: Yes
src/ directory: Yes
App Router: Yes
Turbopack: Yes
Import alias: Yes
```

---

### 2. Initialize Git

```bash
git init
git add .
git commit -m "Initial Next.js setup"
```

---

### 3. Install dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

---

### 4. Configure environment variables

Create the `.env.local` file:

```bash
touch .env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

These values come from the Supabase dashboard.

Important: never add the `SUPABASE_SERVICE_ROLE_KEY` to frontend environment variables.

---

## Supabase

### Create a project

1. Go to Supabase
2. Create a new project
3. Copy the Project URL
4. Copy the anon/public key
5. Add the values to `.env.local`

---

## Authentication

The initial authentication provider will be Google.

Planned providers:

* Google
* Microsoft
* Apple

Expected flow:

```txt
User clicks "Sign in with Google"
  ↓
Supabase Auth
  ↓
Callback to /auth/callback
  ↓
Session is created
  ↓
User is redirected to /chat or /onboarding
```

---

## Initial Data Model

### profiles

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);
```

### friend_requests

```sql
create table public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending',
  created_at timestamptz default now(),

  constraint no_self_request check (sender_id <> receiver_id),
  constraint valid_status check (status in ('pending', 'accepted', 'rejected'))
);
```

### friendships

```sql
create table public.friendships (
  user_id uuid references public.profiles(id) on delete cascade not null,
  friend_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),

  primary key (user_id, friend_id),
  constraint no_self_friendship check (user_id <> friend_id)
);
```

### conversations

```sql
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'direct',
  created_at timestamptz default now(),

  constraint valid_conversation_type check (type in ('direct', 'group'))
);
```

### conversation_members

```sql
create table public.conversation_members (
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  last_read_at timestamptz,

  primary key (conversation_id, user_id)
);
```

### messages

```sql
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  body text,
  created_at timestamptz default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);
```

---

## Security

The application uses **Row Level Security** to protect user data.

All public tables must have RLS enabled:

```sql
alter table public.profiles enable row level security;
alter table public.friend_requests enable row level security;
alter table public.friendships enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
```

Core security rules:

* A user can only edit their own profile
* A user can only view friend requests sent or received by them
* A user can only view conversations where they are a member
* A user can only read messages from conversations where they are a member
* A user can only send messages as themselves
* A user can only edit or delete their own messages

---

## Edge Functions

Edge Functions will be used for critical or multi-step operations.

Examples:

* Accepting a friend request
* Creating friendships on both sides
* Creating a direct conversation
* Preventing duplicate conversations
* Sending notifications
* Validating business rules
* Applying rate limiting

Example flow:

```txt
Frontend calls create-direct-conversation
  ↓
Edge Function validates the user
  ↓
Checks if both users are friends
  ↓
Checks if the conversation already exists
  ↓
Creates conversation + conversation_members
  ↓
Returns conversation_id
```

---

## Realtime

Messages will be synchronized in real time using Supabase Realtime.

Basic flow:

```txt
User sends a message
  ↓
Message is inserted into the messages table
  ↓
Other conversation members receive the message via Realtime
```

For the MVP, the app will use:

* Postgres Changes for new messages
* Broadcast for the “typing...” indicator
* Presence for online/offline status

---

## Scripts

Main project scripts:

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Builds the production version.

```bash
npm run start
```

Starts the application in production mode.

```bash
npm run lint
```

Runs the linter.

---

## Roadmap

### Phase 1 — Setup

* [ ] Create Next.js project
* [ ] Initialize Git
* [ ] Connect Supabase
* [ ] Configure environment variables
* [ ] Create Supabase client
* [ ] Configure session middleware

### Phase 2 — Auth

* [ ] Create login page
* [ ] Add Google login
* [ ] Create authentication callback
* [ ] Protect private routes
* [ ] Redirect users without a session

### Phase 3 — Profile

* [ ] Create `profiles` table
* [ ] Enable RLS
* [ ] Create onboarding page
* [ ] Allow users to choose a username
* [ ] Allow users to edit name and avatar

### Phase 4 — Friends

* [ ] Search users by username
* [ ] Send friend request
* [ ] List received requests
* [ ] Accept friend request
* [ ] Reject friend request
* [ ] Create bidirectional friendship

### Phase 5 — Chat

* [ ] Create direct conversation
* [ ] List conversations
* [ ] Open conversation
* [ ] Send message
* [ ] Receive messages in real time
* [ ] Show author and timestamp

### Phase 6 — Improvements

* [ ] Typing indicator
* [ ] Online/offline status
* [ ] Read receipts
* [ ] File uploads
* [ ] Edited messages
* [ ] Deleted messages

---

## Best Practices

* Never expose the `service_role key` in the frontend
* Enable RLS on every public table
* Validate inputs on both the frontend and Edge Functions
* Use database constraints
* Do not use email as a public identifier
* Use username as the searchable identifier
* Move critical logic into Edge Functions
* Make small and clear commits
* Start simple before adding advanced features

---

## Suggested Commits

```bash
git commit -m "Initial Next.js setup"
git commit -m "Set up Supabase client"
git commit -m "Add authentication flow"
git commit -m "Add user profiles"
git commit -m "Add friend requests"
git commit -m "Add direct conversations"
git commit -m "Add realtime messages"
```

---

## Project Status

Project is in the initial phase.

First objective:

```txt
Enable Google login, create a user profile, and access a private chat page.
```

After that, the friend system and real-time messaging will be implemented.
