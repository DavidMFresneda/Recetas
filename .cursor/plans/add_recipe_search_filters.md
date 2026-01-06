# Plan: Add Recipe Search and Filters to Dashboard

Add a search bar and filter functionality to the dashboard that allows users to filter recipes by name, ingredient, difficulty, and category.

## Implementation Steps

### 1. Extend getRecipesWithFilters Function
- Update `getRecipesWithFilters` in `lib/db/recipes.ts` to support ingredient search
- Add ingredient filtering logic (search within ingredients array)
- Keep existing filters: category, difficulty, search (title/description)

### 2. Create Search and Filter Component
- Create `components/RecipeSearchFilters.tsx` client component
- Include:
  - Search input for recipe name/title
  - Search input for ingredients
  - Dropdown for difficulty filter
  - Dropdown for category filter (with dynamic categories from existing recipes)
  - Clear filters button
- Use URL searchParams for state management (Next.js App Router pattern)

### 3. Update Dashboard Page
- Convert dashboard to use searchParams for filters
- Use `getRecipesWithFilters` instead of `getAllRecipes`
- Extract unique categories from recipes for the category filter
- Pass filter values from searchParams to the filter function
- Display filtered results

### 4. UI/UX Considerations
- Place search bar above the recipes grid
- Use debouncing for search inputs (optional, can use form submission)
- Show active filter count/badges
- Clear visual indication of active filters
- Responsive design for mobile

## Key Files to Update

- `lib/db/recipes.ts` - Extend `getRecipesWithFilters` to support ingredient search
- `components/RecipeSearchFilters.tsx` - New component for search and filters
- `app/dashboard/page.tsx` - Update to use filters and display search component


