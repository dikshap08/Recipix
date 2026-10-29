import React from 'react';
import { Clock, Flame, ChefHat, ArrowRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
  isSaved?: boolean;
  onToggleSave?: (recipeId: string) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onViewDetails,
  isSaved = false,
  onToggleSave,
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
      case 'Medium':
        return 'text-amber-700 bg-amber-50 border-amber-200/60';
      case 'Hard':
        return 'text-rose-700 bg-rose-50 border-rose-200/60';
      default:
        return 'text-stone-700 bg-stone-50 border-stone-200/60';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl hover:shadow-stone-900/10 transition-all flex flex-col justify-between"
      id={`recipe-card-${recipe.id}`}
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Cuisine Pill */}
          <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            {recipe.cuisine}
          </div>

          {/* Match Score (if present) */}
          {recipe.matchScore && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-stone-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border border-stone-100">
              {recipe.matchScore}% Match
            </div>
          )}

          {/* Save / Favorite Button */}
          {onToggleSave && (
            <button
              id={`save-btn-${recipe.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(recipe.id);
              }}
              className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-stone-600 hover:text-rose-500 shadow-md transition-colors"
              aria-label="Save Recipe"
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
                }`}
              />
            </button>
          )}

          {/* Dietary tags */}
          <div className="absolute bottom-3 left-3 flex flex-wrap gap-1 max-w-[80%]">
            {recipe.dietary.slice(0, 2).map((diet) => (
              <span
                key={diet}
                className="bg-amber-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide"
              >
                {diet}
              </span>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-stone-600">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              {recipe.cookingTime}
            </span>
            <span className="text-stone-300">•</span>
            <span className="flex items-center gap-1 text-stone-600">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
              {recipe.calories} kcal
            </span>
            <span className="text-stone-300">•</span>
            <span
              className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold font-heading text-stone-900 group-hover:text-amber-600 transition-colors line-clamp-1">
            {recipe.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-stone-500 line-clamp-2 leading-relaxed">
            {recipe.shortDescription}
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-5 sm:p-6 pt-0">
        <button
          id={`view-details-${recipe.id}`}
          onClick={() => onViewDetails(recipe)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-amber-600 text-stone-800 hover:text-white font-bold text-xs sm:text-sm transition-all duration-200 border border-stone-200 hover:border-amber-600 flex items-center justify-center gap-2 group-hover:shadow-sm cursor-pointer"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
