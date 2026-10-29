import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Clock, Utensils, Check } from 'lucide-react';
import { CuisineType, DietaryPreference, DifficultyLevel, RecipeFilterState } from '../types/recipe';

interface FilterPanelProps {
  filters: RecipeFilterState;
  onFilterChange: (newFilters: RecipeFilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

const CUISINES: (CuisineType | 'All')[] = [
  'All',
  'Indian',
  'Italian',
  'Chinese',
  'Mexican',
  'American',
];

const DIETS: (DietaryPreference | 'All')[] = [
  'All',
  'Vegetarian',
  'Vegan',
  'High Protein',
  'Gluten Free',
  'Jain',
];

const DIFFICULTIES: (DifficultyLevel | 'All')[] = ['All', 'Easy', 'Medium', 'Hard'];

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleCuisineSelect = (c: CuisineType | 'All') => {
    onFilterChange({ ...filters, cuisine: c });
  };

  const handleDietarySelect = (d: DietaryPreference | 'All') => {
    onFilterChange({ ...filters, dietary: d });
  };

  const handleDifficultySelect = (diff: DifficultyLevel | 'All') => {
    onFilterChange({ ...filters, difficulty: diff });
  };

  const handleMaxTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, maxTime: Number(e.target.value) });
  };

  const hasActiveFilters =
    filters.searchQuery !== '' ||
    filters.cuisine !== 'All' ||
    filters.dietary !== 'All' ||
    filters.difficulty !== 'All' ||
    filters.maxTime > 0;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200/90 shadow-sm space-y-6">
      {/* Top Search Bar & Counter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="recipe-search-bar"
            type="text"
            placeholder="Search by title, ingredient, or keyword..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Results count & Reset button */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs">
          <span className="font-semibold text-stone-500">
            Showing <strong className="text-stone-900">{totalResults}</strong> recipes
          </span>

          {hasActiveFilters && (
            <button
              id="reset-filters-btn"
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Options Rows */}
      <div className="space-y-4 pt-2 border-t border-stone-100">
        
        {/* Cuisine Filter Pills */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold font-heading text-stone-700 mb-2">
            <Utensils className="w-3.5 h-3.5 text-amber-600" />
            <span>Cuisine:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CUISINES.map((c) => (
              <button
                key={c}
                id={`filter-cuisine-${c.toLowerCase()}`}
                type="button"
                onClick={() => handleCuisineSelect(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filters.cuisine === c
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary Filter Pills */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold font-heading text-stone-700 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Dietary Preference:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {DIETS.map((d) => (
              <button
                key={d}
                id={`filter-dietary-${d.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleDietarySelect(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filters.dietary === d
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Row with Cooking Time & Difficulty Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Max Cooking Time */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-400 shrink-0" />
            <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Max Time:</span>
            <select
              id="filter-max-time"
              value={filters.maxTime}
              onChange={handleMaxTimeChange}
              className="flex-1 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-xs font-semibold focus:outline-none focus:border-amber-500"
            >
              <option value={0}>Any Duration</option>
              <option value={15}>Under 15 Mins (Fast)</option>
              <option value={25}>Under 25 Mins</option>
              <option value={35}>Under 35 Mins</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700 whitespace-nowrap">Difficulty:</span>
            <div className="flex gap-1 flex-1">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  id={`filter-diff-${diff.toLowerCase()}`}
                  type="button"
                  onClick={() => handleDifficultySelect(diff)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-center ${
                    filters.difficulty === diff
                      ? 'bg-stone-800 text-white'
                      : 'bg-[#FAF7F2] text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
