import Link from 'next/link';
import { signOut } from '@/app/actions/auth';
import { getCurrentUser } from '@/lib/auth';
import { getCurrentUserProfile } from '@/lib/db/profiles';
import { User, LogOut } from 'lucide-react';

export async function UserMenu() {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentUserProfile() : null;

  if (!user) {
    return (
      <nav className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Sign up
        </Link>
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-4">
      <Link
        href="/me"
        className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">
          {profile?.full_name || profile?.username || user.email}
        </span>
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </form>
    </nav>
  );
}

