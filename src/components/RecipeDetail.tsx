import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Flame,
  ChefHat,
  Users,
  CheckCircle,
  Circle,
  Lightbulb,
  Printer,
  Share2,
  Heart,
  Activity,
  Award
} from 'lucide-react';
import { Recipe } from '../types/recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: (recipeId: string) => void;
}

export const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  isSaved = false,
  onToggleSave,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(recipe.servings || 2);
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to adjust ingredient amounts based on servings multiplier
  const scaleAmount = (amountStr: string) => {
    const baseServings = recipe.servings || 2;
    const ratio = servingsMultiplier / baseServings;
    if (ratio === 1) return amountStr;

    // Check if starts with a number or fraction
    const numMatch = amountStr.match(/^([\d.]+)/);
    if (numMatch) {
      const originalNum = parseFloat(numMatch[1]);
      const scaled = (originalNum * ratio).toFixed(1).replace(/\.0$/, '');
      return amountStr.replace(/^([\d.]+)/, scaled);
    }
    return amountStr;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-sm border border-stone-200 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recipes</span>
        </button>

        <div className="flex items-center gap-2">
          {onToggleSave && (
            <button
              id="detail-save-btn"
              onClick={() => onToggleSave(recipe.id)}
              className="p-2.5 rounded-xl bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-600 border border-stone-200 shadow-xs transition-colors cursor-pointer"
              title={isSaved ? 'Remove from Saved' : 'Save Recipe'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}

          <button
            id="detail-share-btn"
            onClick={handleShare}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-xs transition-colors cursor-pointer relative"
            title="Share Recipe"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-stone-900 text-white text-[10px] rounded-md shadow-md whitespace-nowrap">
                Link Copied!
              </span>
            )}
          </button>

          <button
            id="detail-print-btn"
            onClick={handlePrint}
            className="p-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-xs transition-colors cursor-pointer"
            title="Print Recipe"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Media & Recipe Title Header */}
      <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm">
        {/* Large Image Placeholder / High-Resolution Food Photo */}
        <div className="relative aspect-[21/9] sm:aspect-[2/1] w-full bg-stone-900 overflow-hidden">
          <img
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80'}
            alt={recipe.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80';
            }}
            className="w-full h-full object-cover object-center opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent" />

          {/* Floating tags */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-amber-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                  {recipe.cuisine}
                </span>
                {recipe.dietary.map((diet) => (
                  <span
                    key={diet}
                    className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20"
                  >
                    {diet}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
                {recipe.title}
              </h1>
            </div>

            {recipe.matchScore && (
              <div className="bg-white/95 backdrop-blur-md text-stone-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                <Award className="w-4 h-4 text-amber-500" />
                <span>{recipe.matchScore}% Match</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 border-b border-stone-100 p-4 sm:p-6 bg-stone-50/50">
          <div className="p-2 sm:p-3 text-center">
            <span className="text-xs text-stone-500 font-semibold block">Cooking Time</span>
            <div className="flex items-center justify-center gap-1.5 font-bold text-stone-800 text-sm sm:text-base mt-0.5">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>{recipe.cookingTime}</span>
            </div>
          </div>

          <div className="p-2 sm:p-3 text-center">
            <span className="text-xs text-stone-500 font-semibold block">Difficulty</span>
            <span className="font-bold text-stone-800 text-sm sm:text-base mt-0.5 block">
              {recipe.difficulty}
            </span>
          </div>

          <div className="p-2 sm:p-3 text-center">
            <span className="text-xs text-stone-500 font-semibold block">Calories / Serving</span>
            <div className="flex items-center justify-center gap-1.5 font-bold text-stone-800 text-sm sm:text-base mt-0.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{recipe.calories} kcal</span>
            </div>
          </div>

          <div className="p-2 sm:p-3 text-center">
            <span className="text-xs text-stone-500 font-semibold block">Portions</span>
            <div className="flex items-center justify-center gap-1.5 font-bold text-stone-800 text-sm sm:text-base mt-0.5">
              <Users className="w-4 h-4 text-amber-600" />
              <span>{servingsMultiplier} Servings</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 sm:p-8">
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-normal">
            {recipe.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Content Grid: Ingredients & Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col (5 cols): Ingredients List & Servings Scaler */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-5">
            
            {/* Header + Portion Scaler */}
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-stone-900">
                  Ingredients
                </h3>
                <p className="text-xs text-stone-500">
                  Check items off as you prep
                </p>
              </div>

              {/* Servings Adjuster */}
              <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-xl border border-stone-200">
                <button
                  id="portion-dec-btn"
                  onClick={() => setServingsMultiplier(Math.max(1, servingsMultiplier - 1))}
                  className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:text-amber-600 font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                  title="Decrease Servings"
                >
                  -
                </button>
                <span className="text-xs font-bold text-stone-900 px-1.5">
                  {servingsMultiplier}
                </span>
                <button
                  id="portion-inc-btn"
                  onClick={() => setServingsMultiplier(servingsMultiplier + 1)}
                  className="w-7 h-7 rounded-lg bg-white text-stone-700 hover:text-amber-600 font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                  title="Increase Servings"
                >
                  +
                </button>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-2.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = !!checkedIngredients[ing.id];
                return (
                  <li
                    key={ing.id}
                    id={`ing-item-${ing.id}`}
                    onClick={() => toggleIngredient(ing.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                      isChecked ? 'bg-stone-50 text-stone-400 line-through' : 'hover:bg-[#FAF7F2] text-stone-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-amber-600 shrink-0 focus:outline-none"
                    >
                      {isChecked ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-300" />
                      )}
                    </button>
                    <div className="text-sm font-medium flex-1 flex justify-between gap-2">
                      <span>{ing.name}</span>
                      <span className="font-bold text-stone-600 whitespace-nowrap">
                        {scaleAmount(ing.amount)} {ing.unit ? ing.unit : ''}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Nutrition Section Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold font-heading text-stone-900">
                Nutrition Facts
              </h3>
            </div>
            <p className="text-xs text-stone-500">
              Estimated per serving based on calculated recipe amounts
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-100 text-center">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block">Protein</span>
                <span className="text-base font-bold text-stone-900 font-heading">
                  {recipe.nutrition.protein}
                </span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-100 text-center">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block">Carbs</span>
                <span className="text-base font-bold text-stone-900 font-heading">
                  {recipe.nutrition.carbs}
                </span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-100 text-center">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block">Fats</span>
                <span className="text-base font-bold text-stone-900 font-heading">
                  {recipe.nutrition.fat}
                </span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-100 text-center">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block">Fiber</span>
                <span className="text-base font-bold text-stone-900 font-heading">
                  {recipe.nutrition.fiber}
                </span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-100 text-center">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block">Sodium</span>
                <span className="text-base font-bold text-stone-900 font-heading">
                  {recipe.nutrition.sodium || '420mg'}
                </span>
              </div>
              <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-stone-100 text-center">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block">Calories</span>
                <span className="text-base font-bold text-amber-700 font-heading">
                  {recipe.nutrition.calories}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Col (7 cols): Step-by-Step Instructions & Tips Section */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Instructions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-stone-900">
                Step-by-Step Instructions
              </h3>
              <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                {recipe.instructions.length} Steps
              </span>
            </div>

            <div className="space-y-6">
              {recipe.instructions.map((step) => {
                const isDone = !!completedSteps[step.step];
                return (
                  <div
                    key={step.step}
                    id={`instruction-step-${step.step}`}
                    onClick={() => toggleStep(step.step)}
                    className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50/40 border-emerald-200/60'
                        : 'bg-[#FAF7F2]/60 border-stone-200/80 hover:border-amber-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm shadow-xs transition-colors ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-stone-900 text-white'
                      }`}
                    >
                      {isDone ? <CheckCircle className="w-5 h-5" /> : step.step}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`font-bold font-heading text-sm sm:text-base ${
                            isDone ? 'text-emerald-900 line-through' : 'text-stone-900'
                          }`}
                        >
                          {step.title || `Step ${step.step}`}
                        </h4>
                        {step.timeEstimate && (
                          <span className="text-xs font-medium text-stone-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            {step.timeEstimate}
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-sm leading-relaxed ${
                          isDone ? 'text-stone-400' : 'text-stone-600'
                        }`}
                      >
                        {step.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tips Section */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-7 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-2 text-amber-900">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h3 className="text-base sm:text-lg font-bold font-heading">
                  Chef's Pro-Tips & Substitutions
                </h3>
              </div>

              <ul className="space-y-2.5 text-sm text-amber-950/80">
                {recipe.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
