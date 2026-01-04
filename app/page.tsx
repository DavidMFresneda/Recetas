import Link from "next/link";
import { Clock, Heart, ArrowRight, ChefHat } from "lucide-react";
import { Header } from "../components/Header";
import { ConnectionTest } from "../components/ConnectionTest";

export default function Home() {
  const featuredRecipes = [
    {
      id: 1,
      title: "Creamy Garlic Pasta",
      author: "Maria Rossi",
      time: "20 min",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=800&auto=format&fit=crop",
      category: "Pasta"
    },
    {
      id: 2,
      title: "Fresh Berry Smoothie",
      author: "Alex Chen",
      time: "10 min",
      image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?q=80&w=800&auto=format&fit=crop",
      category: "Breakfast"
    },
    {
      id: 3,
      title: "Grilled Salmon",
      author: "John Smith",
      time: "35 min",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800&auto=format&fit=crop",
      category: "Main Dish"
    },
    {
      id: 4,
      title: "Avocado Toast",
      author: "Sarah J.",
      time: "15 min",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
      category: "Breakfast"
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-zinc-50 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
                Share your <span className="text-orange-500">culinary secrets</span> with the world
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
                Join a community of food lovers. Discover thousands of recipes, share your own, and save your favorites for later.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/recipes"
                  className="rounded-full bg-orange-500 px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-600"
                >
                  Explore Recipes
                </Link>
                <Link href="/signup" className="group flex items-center gap-2 text-base font-semibold text-zinc-900">
                  Join Community <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative blobs */}
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-yellow-100/50 blur-3xl" />
        </section>

        {/* Connection Test Section */}
        {/* <section className="py-8 bg-zinc-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <ConnectionTest />
          </div>
        </section> */}

        {/* Latest Recipes Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Latest Discoveries</h2>
                <p className="mt-2 text-zinc-600">Check out the newest recipes from our talented community.</p>
              </div>
              <Link href="/recipes" className="hidden text-sm font-semibold text-orange-500 hover:text-orange-600 sm:block">
                View all recipes →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredRecipes.map((recipe) => (
                <article key={recipe.id} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 backdrop-blur-sm">
                        {recipe.category}
                      </span>
                    </div>
                    <button className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-zinc-400 transition-colors hover:text-red-500">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                      <Clock className="h-3 w-3" />
                      {recipe.time}
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900">{recipe.title}</h3>
                    <p className="text-sm text-zinc-500">by {recipe.author}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-12 text-center sm:hidden">
              <Link href="/recipes" className="inline-block text-sm font-semibold text-orange-500 hover:text-orange-600">
                View all recipes →
              </Link>
            </div>
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
