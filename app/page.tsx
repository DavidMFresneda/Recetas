import Link from "next/link";
import { ArrowRight, ChefHat } from "lucide-react";
import { Header } from "../components/Header";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-zinc-50 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex justify-center mb-8">
                <ChefHat className="h-16 w-16 text-orange-500" />
              </div>
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
                Share your <span className="text-orange-500">culinary secrets</span> with the world
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                Join a community of food lovers. Discover thousands of recipes, share your own, and connect with fellow cooking enthusiasts.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-full bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                >
                  Get Started
                </Link>
                <Link 
                  href="/login" 
                  className="group flex items-center gap-2 text-base font-semibold text-zinc-900"
                >
                  Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-100/50 blur-3xl" />
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
                Why RecipeShare?
              </h2>
              <p className="mt-4 text-lg text-zinc-600">
                Everything you need to share and discover amazing recipes
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">Share Recipes</h3>
                <p className="text-zinc-600">
                  Upload and share your favorite recipes with the community. Include ingredients, instructions, and photos.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">Discover New Recipes</h3>
                <p className="text-zinc-600">
                  Browse through thousands of recipes shared by home cooks. Find inspiration for your next meal.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                  <ChefHat className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-zinc-900 mb-2">Connect with Cooks</h3>
                <p className="text-zinc-600">
                  Join a vibrant community of food enthusiasts. Share tips, ask questions, and learn from others.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24 bg-zinc-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mb-4">
              Ready to start sharing?
            </h2>
            <p className="text-lg text-zinc-600 mb-8">
              Join RecipeShare today and become part of our growing community of food lovers.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center rounded-full bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-2">
              <ChefHat className="h-6 w-6 text-orange-500" />
              <span className="text-lg font-bold tracking-tight">RecipeShare</span>
            </div>
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} RecipeShare. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-zinc-500 hover:text-zinc-900">Privacy</Link>
              <Link href="/terms" className="text-sm text-zinc-500 hover:text-zinc-900">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
