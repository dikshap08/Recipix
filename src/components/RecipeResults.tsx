import React, { useState, useMemo } from 'react';
import { Recipe, RecipeFilterState } from '../types/recipe';
import { FilterPanel } from './FilterPanel';
import { RecipeCard } from './RecipeCard';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { Sparkles, Utensils } from 'lucide-react';

interface RecipeResultsProps {
  recipes: Recipe[];
  onViewDetails: (recipe: Recipe) => void;
  onGoToGenerator: () => void;
  error?: string | null;
  onClearError?: () => void;
  savedRecipeIds: string[];
  onToggleSave: (recipeId: string) => void;
}

export const RecipeResults: React.FC<RecipeResultsProps> = ({
  recipes,
  onViewDetails,
  onGoToGenerator,
  error,
  onClearError,
  savedRecipeIds,
  onToggleSave,
}) => {
  const [filters, setFilters] = useState<RecipeFilterState>({
    searchQuery: '',
    cuisine: 'All',
    dietary: 'All',
    difficulty: 'All',
    maxTime: 0,
  });

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      cuisine: 'All',
      dietary: 'All',
      difficulty: 'All',
      maxTime: 0,
    });
  };

  // Filter recipes based on active state
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      // 1. Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(query);
        const matchesDesc = recipe.shortDescription.toLowerCase().includes(query);
        const matchesCuisine = recipe.cuisine.toLowerCase().includes(query);
        const matchesIngredient = recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(query)
        );
        if (!matchesTitle && !matchesDesc && !matchesCuisine && !matchesIngredient) {
          return false;
        }
      }

      // 2. Cuisine
      if (filters.cuisine !== 'All' && recipe.cuisine !== filters.cuisine) {
        return false;
      }

      // 3. Dietary
      if (filters.dietary !== 'All' && !recipe.dietary.includes(filters.dietary)) {
        return false;
      }

      // 4. Difficulty
      if (filters.difficulty !== 'All' && recipe.difficulty !== filters.difficulty) {
        return false;
      }

      // 5. Max Time
      if (filters.maxTime > 0) {
        const timeMatch = recipe.cookingTime.match(/(\d+)/);
        const minutes = timeMatch ? parseInt(timeMatch[1], 10) : 30;
        if (minutes > filters.maxTime) {
          return false;
        }
      }

      return true;
    });
  }, [recipes, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Recipe Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
            Discover & Savor Recipes
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Browse through expertly formulated recipes and your own AI-generated creations.
          </p>
        </div>

        <button
          id="results-generate-new-btn"
          onClick={onGoToGenerator}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>Generate New Recipe</span>
        </button>
      </div>

      {/* Filter Panel & Search */}
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        totalResults={filteredRecipes.length}
      />

      {/* Error state if any */}
      {error && onClearError && (
        <ErrorState errorMessage={error} onRetry={onClearError} />
      )}

      {/* Empty State */}
      {!error && filteredRecipes.length === 0 && (
        <EmptyState
          onResetFilters={handleResetFilters}
          onGoToGenerator={onGoToGenerator}
        />
      )}

      {/* Recipes Grid */}
      {!error && filteredRecipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onViewDetails={onViewDetails}
              isSaved={savedRecipeIds.includes(recipe.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
