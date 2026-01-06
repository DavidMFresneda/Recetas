import Link from "next/link";
import { ChefHat } from "lucide-react";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <ChefHat className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-bold tracking-tight">RecipeShare</span>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}

