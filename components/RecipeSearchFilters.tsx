'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useTransition, useEffect } from 'react';

interface RecipeSearchFiltersProps {
  categories: string[];
}

export function RecipeSearchFilters({ categories }: RecipeSearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [ingredient, setIngredient] = useState(searchParams.get('ingredient') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Sync state with URL params when they change
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setIngredient(searchParams.get('ingredient') || '');
    setDifficulty(searchParams.get('difficulty') || '');
    setCategory(searchParams.get('category') || '');
    // Show advanced filters if any are active
    const hasAdvancedFilters = searchParams.get('ingredient') || searchParams.get('difficulty') || searchParams.get('category');
    setShowAdvanced(!!hasAdvancedFilters);
  }, [searchParams]);

  const updateFilters = () => {
    const params = new URLSearchParams();
    
    if (search.trim()) params.set('search', search.trim());
    if (ingredient.trim()) params.set('ingredient', ingredient.trim());
    if (difficulty) params.set('difficulty', difficulty);
    if (category) params.set('category', category);

    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch('');
    setIngredient('');
    setDifficulty('');
    setCategory('');
    startTransition(() => {
      router.push('/dashboard');
    });
  };

  const hasActiveFilters = search || ingredient || difficulty || category;

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-zinc-600" />
          <h2 className="text-lg font-semibold text-zinc-900">Search Recipes</h2>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900 transition-colors"
        >
          {showAdvanced ? (
            <>
              <span>Ocultar detalles</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Detalles</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {/* Simple Search Bar */}
      <div className="mb-4">
        <div className="flex gap-2">
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateFilters();
              }
            }}
            placeholder="Buscar por nombre de receta..."
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
          />
          <button
            onClick={updateFilters}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="h-4 w-4" />
            {isPending ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Advanced Filters (Collapsible) */}
      {showAdvanced && (
        <div className="border-t border-zinc-200 pt-4 mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Search by Ingredient */}
            <div>
              <label htmlFor="ingredient" className="block text-sm font-medium text-zinc-700 mb-2">
                Ingrediente
              </label>
              <input
                id="ingredient"
                type="text"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    updateFilters();
                  }
                }}
                placeholder="Buscar por ingrediente..."
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
              />
            </div>

            {/* Filter by Difficulty */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-zinc-700 mb-2">
                Dificultad
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  // Auto-apply filter on change
                  setTimeout(() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.value) {
                      params.set('difficulty', e.target.value);
                    } else {
                      params.delete('difficulty');
                    }
                    startTransition(() => {
                      router.push(`/dashboard?${params.toString()}`);
                    });
                  }, 0);
                }}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
              >
                <option value="">Todas las dificultades</option>
                <option value="easy">Fácil</option>
                <option value="medium">Media</option>
                <option value="hard">Difícil</option>
              </select>
            </div>

            {/* Filter by Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-zinc-700 mb-2">
                Categoría
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  // Auto-apply filter on change
                  setTimeout(() => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.value) {
                      params.set('category', e.target.value);
                    } else {
                      params.delete('category');
                    }
                    startTransition(() => {
                      router.push(`/dashboard?${params.toString()}`);
                    });
                  }, 0);
                }}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-0 sm:text-sm"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

