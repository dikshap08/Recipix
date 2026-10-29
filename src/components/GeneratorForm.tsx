import React, { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  ArrowRight,
  Utensils
} from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';
import {
  CuisineType,
  DietaryPreference,
  RecipeGenerationParams,
  Recipe
} from '../types/recipe';
import { generateRecipe } from '../services/api';

interface GeneratorFormProps {
  onRecipeGenerated: (recipe: Recipe) => void;
  onError: (errorMsg: string) => void;
  pantryIngredients: string[];
  onNavigateToPantry?: () => void;
}

const DIETARY_OPTIONS: DietaryPreference[] = [
  'No Preference',
  'Vegetarian',
  'Vegan',
  'High Protein',
];

const CUISINE_OPTIONS: CuisineType[] = [
  'Any',
  'Indian',
  'Italian',
  'Chinese',
  'Mexican',
  'Continental',
];

const QUICK_ADD_SUGGESTIONS = [
  'Garlic',
  'Ginger',
  'Onion',
  'Tomato',
  'Chilli',
  'Butter',
  'Cheese',
  'Lemon',
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onRecipeGenerated,
  onError,
  pantryIngredients,
  onNavigateToPantry,
}) => {
  // 1. Pantry selected ingredients
  const [selectedPantry, setSelectedPantry] = useState<string[]>(() => {
    return pantryIngredients;
  });

  // Keep selectedPantry synced when pantryIngredients change
  React.useEffect(() => {
    setSelectedPantry(pantryIngredients);
  }, [pantryIngredients]);

  // 2. Manually added ingredients
  const [manualInput, setManualInput] = useState('');
  const [manualIngredients, setManualIngredients] = useState<string[]>([]);

  // 3. Quick-added ingredients (that aren't in pantry or manual)
  const [quickAdded, setQuickAdded] = useState<string[]>([]);

  // 4. Dietary Preference (Single Select)
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('No Preference');

  // 5. Cuisine Style (Single Select)
  const [cuisine, setCuisine] = useState<CuisineType>('Any');

  // 6. Number of People (Default 2)
  const [servings, setServings] = useState<number>(2);

  // Status & Validation
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Toggle pantry item selection
  const handleTogglePantryItem = (item: string) => {
    setSelectedPantry((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
    if (validationError) setValidationError(null);
  };

  // Add manual ingredients from text input
  const handleAddManual = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = manualInput.trim();
    if (!trimmed) return;

    const items = trimmed
      .split(/[,;\n]+/)
      .map((i) => i.trim())
      .filter(Boolean);

    const newAdditions: string[] = [];
    items.forEach((item) => {
      const formatted = item.charAt(0).toUpperCase() + item.slice(1);
      // Check if already in manual or pantry
      if (!manualIngredients.includes(formatted) && !selectedPantry.includes(formatted)) {
        newAdditions.push(formatted);
      }
    });

    if (newAdditions.length > 0) {
      setManualIngredients((prev) => [...prev, ...newAdditions]);
      setManualInput('');
      if (validationError) setValidationError(null);
    } else {
      setManualInput('');
    }
  };

  const handleRemoveManual = (item: string) => {
    setManualIngredients((prev) => prev.filter((i) => i !== item));
  };

  // Quick add suggestion click
  const handleToggleQuickAdd = (suggestion: string) => {
    // If it's already in pantry, toggle it in selectedPantry
    if (pantryIngredients.includes(suggestion)) {
      handleTogglePantryItem(suggestion);
      return;
    }

    // Otherwise toggle in quickAdded
    setQuickAdded((prev) => {
      if (prev.includes(suggestion)) {
        return prev.filter((s) => s !== suggestion);
      }
      return [...prev, suggestion];
    });

    if (validationError) setValidationError(null);
  };

  // Check if a suggestion is currently selected anywhere
  const isSuggestionActive = (suggestion: string) => {
    return (
      selectedPantry.includes(suggestion) ||
      manualIngredients.includes(suggestion) ||
      quickAdded.includes(suggestion)
    );
  };

  // All combined ingredients
  const allIngredients = Array.from(
    new Set([...selectedPantry, ...manualIngredients, ...quickAdded])
  );

  // Servings decrement & increment
  const handleDecrementServings = () => {
    setServings((prev) => Math.max(1, prev - 1));
  };

  const handleIncrementServings = () => {
    setServings((prev) => Math.min(20, prev + 1));
  };

  // Submit and generate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let combined = [...allIngredients];
    const pending = manualInput.trim();
    if (pending) {
      const items = pending
        .split(/[,;\n]+/)
        .map((i) => i.trim())
        .filter(Boolean);
      items.forEach((item) => {
        const formatted = item.charAt(0).toUpperCase() + item.slice(1);
        if (!combined.includes(formatted)) {
          combined.push(formatted);
        }
      });
    }

    if (combined.length === 0) {
      setValidationError('Please select or add at least one ingredient to generate a recipe.');
      return;
    }

    setValidationError(null);
    setIsLoading(true);

    try {
      const params: RecipeGenerationParams = {
        ingredientsText: combined.join(', '),
        dietaryPreference,
        cuisine,
        servings,
      };

      const recipe = await generateRecipe(params);
      setIsLoading(false);
      onRecipeGenerated(recipe);
    } catch (err: any) {
      setIsLoading(false);
      onError(err?.message || 'Unable to generate the recipe right now. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Container Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-900/5 border border-stone-200/90 relative overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Recipe Generator</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 tracking-tight">
            Create Your Custom Recipe
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Select the ingredients you have and let AI create a recipe for you.
          </p>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner />
            <p className="text-center text-sm font-semibold text-stone-600 mt-4">
              Synthesizing recipes with {allIngredients.slice(0, 4).join(', ')}...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* SECTION 1: Select Ingredients From Your Pantry */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold font-heading text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>Select Ingredients From Your Pantry</span>
                </label>
                {pantryIngredients.length > 0 && (
                  <span className="text-xs font-semibold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full">
                    {selectedPantry.length} of {pantryIngredients.length} selected
                  </span>
                )}
              </div>

              {pantryIngredients.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-stone-600 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span>No ingredients found in your pantry yet.</span>
                  {onNavigateToPantry && (
                    <button
                      type="button"
                      onClick={onNavigateToPantry}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                    >
                      Manage Pantry &rarr;
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {pantryIngredients.map((item) => {
                    const isSelected = selectedPantry.includes(item);
                    return (
                      <button
                        key={item}
                        id={`pantry-select-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        type="button"
                        onClick={() => handleTogglePantryItem(item)}
                        className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 border text-left cursor-pointer ${
                          isSelected
                            ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20 font-semibold'
                            : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-amber-50/40'
                        }`}
                      >
                        <span className="truncate">{item}</span>
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                            isSelected
                              ? 'bg-white text-amber-600 font-bold'
                              : 'border border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2: Add Ingredients (Manual input) */}
            <div className="space-y-3">
              <label
                htmlFor="manual-ingredient-input"
                className="text-sm font-bold font-heading text-stone-900 flex items-center gap-2"
              >
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Add Ingredients</span>
              </label>

              <div className="flex gap-2">
                <input
                  id="manual-ingredient-input"
                  type="text"
                  placeholder="Enter ingredients separated by commas..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddManual();
                    }
                  }}
                  className="flex-grow px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all placeholder:text-stone-400"
                />
                <button
                  id="manual-ingredient-add-btn"
                  type="button"
                  onClick={() => handleAddManual()}
                  className="px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold shadow-sm transition-colors cursor-pointer shrink-0"
                >
                  Add
                </button>
              </div>

              {/* Display manually added ingredient chips */}
              {manualIngredients.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {manualIngredients.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-medium"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveManual(item)}
                        className="hover:text-amber-700 cursor-pointer"
                        aria-label={`Remove ${item}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION 3: Quick Add Suggestions */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 font-heading block">
                Quick Add Suggestions
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ADD_SUGGESTIONS.map((suggestion) => {
                  const active = isSuggestionActive(suggestion);
                  return (
                    <button
                      key={suggestion}
                      id={`quick-suggestion-${suggestion.toLowerCase()}`}
                      type="button"
                      onClick={() => handleToggleQuickAdd(suggestion)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        active
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm shadow-amber-600/20'
                          : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-amber-300 hover:text-amber-800 hover:bg-amber-50/50'
                      }`}
                    >
                      {active ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <Plus className="w-3 h-3 text-amber-600" />
                      )}
                      <span>{suggestion}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 4: Dietary Preference (Single Select) */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="text-sm font-bold font-heading text-stone-900 block">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {DIETARY_OPTIONS.map((option) => {
                  const isSelected = dietaryPreference === option;
                  return (
                    <button
                      key={option}
                      id={`dietary-opt-${option.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setDietaryPreference(option)}
                      className={`py-2.5 px-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 5: Cuisine Style (Single Select) */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="text-sm font-bold font-heading text-stone-900 block">
                Cuisine Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {CUISINE_OPTIONS.map((opt) => {
                  const isSelected = cuisine === opt;
                  return (
                    <button
                      key={opt}
                      id={`cuisine-opt-${opt.toLowerCase().replace(/\s+/g, '-')}`}
                      type="button"
                      onClick={() => setCuisine(opt)}
                      className={`py-2.5 px-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all border text-center cursor-pointer ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                          : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECTION 6: Number of People (Quantity selector [-] 2 [+]) */}
            <div className="space-y-2.5 pt-2 border-t border-stone-100">
              <label className="text-sm font-bold font-heading text-stone-900 block">
                Number of People
              </label>
              
              <div className="flex items-center gap-4">
                <div className="inline-flex items-center bg-[#FAF7F2] border border-stone-200 rounded-2xl p-1 shadow-inner">
                  <button
                    id="servings-decrement-btn"
                    type="button"
                    onClick={handleDecrementServings}
                    disabled={servings <= 1}
                    aria-label="Decrease servings"
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span
                    id="servings-display"
                    className="w-14 text-center font-heading font-extrabold text-lg text-stone-900"
                  >
                    {servings}
                  </span>

                  <button
                    id="servings-increment-btn"
                    type="button"
                    onClick={handleIncrementServings}
                    disabled={servings >= 20}
                    aria-label="Increase servings"
                    className="w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-800 font-bold flex items-center justify-center hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <span className="text-xs text-stone-500 font-medium">
                  {servings === 1 ? '1 person serving' : `${servings} people servings`}
                </span>
              </div>
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Selected Ingredients Summary badge if any */}
            {allIngredients.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-stone-200 text-xs text-stone-600 flex items-center justify-between gap-3">
                <span className="font-semibold text-stone-800">
                  Ready with {allIngredients.length} {allIngredients.length === 1 ? 'ingredient' : 'ingredients'}:
                </span>
                <span className="truncate max-w-[280px] sm:max-w-md text-stone-500">
                  {allIngredients.join(', ')}
                </span>
              </div>
            )}

            {/* SECTION 7: Generate Recipe Main Button */}
            <div className="pt-2">
              <button
                id="generate-recipe-submit-btn"
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:via-orange-700 hover:to-amber-800 text-white font-extrabold text-base shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                <span>Generate Recipe</span>
                <ArrowRight className="w-4 h-4 text-white/80" />
              </button>
              <p className="text-center text-xs text-stone-400 mt-2.5">
                AI customized with your pantry items, cuisine style, and dietary preferences
              </p>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
