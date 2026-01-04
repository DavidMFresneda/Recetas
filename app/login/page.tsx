import Link from 'next/link';
import { signIn } from '@/app/actions/auth';
import { Header } from '@/components/Header';
import { ChefHat } from 'lucide-react';

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ChefHat className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              Or{' '}
              <Link
                href="/signup"
                className="font-medium text-orange-500 hover:text-orange-600"
              >
                create a new account
              </Link>
            </p>
          </div>

          {searchParams.error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{searchParams.error}</p>
            </div>
          )}

          <form action={signIn} className="mt-8 space-y-6">
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-500 focus:z-10 focus:border-orange-500 focus:outline-none focus:ring-orange-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-lg border border-transparent bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

