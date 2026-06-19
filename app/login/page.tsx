'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <button
        onClick={signInWithGoogle}
        className="rounded-lg bg-black px-4 py-2 text-white"
      >
        Sign in with Google
      </button>
    </main>
  )
}