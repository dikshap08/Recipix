import React from 'react';
import { Utensils, RotateCcw, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  onResetFilters: () => void;
  onGoToGenerator: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onResetFilters, onGoToGenerator }) => {
  return (
    <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-stone-200/90 shadow-sm max-w-xl mx-auto space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mx-auto shadow-inner">
        <Utensils className="w-9 h-9" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold font-heading text-stone-900">
          No Matching Recipes Found
        </h3>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          We couldn't find any recipes matching your exact filter combination. You can reset your filters or generate a brand new recipe with our AI!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          id="empty-state-reset-btn"
          onClick={onResetFilters}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Filters</span>
        </button>

        <button
          id="empty-state-generate-btn"
          onClick={onGoToGenerator}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate New Recipe</span>
        </button>
      </div>
    </div>
  );
};
