# Telegram Clone Web

A real-time chat web application inspired by Telegram.

This project is currently in the early development stage and focuses on building a simple, secure, and scalable chat experience using modern web technologies.

---

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* Supabase
* Supabase Auth
* Supabase Realtime
* Supabase Storage

---

## Features

### Planned MVP

* User authentication
* User profiles
* Username setup
* Friend search
* Friend requests
* Direct conversations
* Real-time messaging

### Future Improvements

* Online status
* Typing indicators
* Read receipts
* File and image sharing
* Group chats
* Message reactions
* Push notifications

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at:

```txt
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Runs the production build.

```bash
npm run lint
```

Runs linting.

---

## Project Structure

```txt
src/
  app/
  components/
  features/
  lib/
  types/
```

---

## Status

This project is under active development.

Current focus:

```txt
Authentication, user profiles, and the first version of direct messaging.
```

---

## License

MIT
