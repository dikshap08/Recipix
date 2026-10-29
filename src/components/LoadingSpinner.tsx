import React, { useEffect, useState } from 'react';
import { ChefHat, Sparkles, Flame, Utensils } from 'lucide-react';
import { motion } from 'motion/react';

interface LoadingSpinnerProps {
  message?: string;
}

const COOKING_STEPS = [
  'Inspecting ingredient profiles & fresh produce...',
  'Matching culinary flavor affinities & regional spices...',
  'Calibrating heat levels & cooking times...',
  'Calculating precise macronutrients & portion scaling...',
  'Writing executive chef tips & plating instructions...'
];

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % COOKING_STEPS.length);
    }, 600);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-6">
      {/* Animated Glowing Emblem */}
      <div className="relative">
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 to-orange-500/30 blur-xl animate-pulse" />

        <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-orange-500/30">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ChefHat className="w-12 h-12 text-white" />
          </motion.div>

          <motion.div
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-amber-600"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="absolute -bottom-2 -left-2 w-7 h-7 rounded-full bg-stone-900 text-white shadow-md flex items-center justify-center"
          >
            <Flame className="w-4 h-4 text-orange-400" />
          </motion.div>
        </div>
      </div>

      {/* Text Info */}
      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-bold font-heading text-stone-900 flex items-center justify-center gap-2">
          <span>Synthesizing Recipe</span>
          <span className="inline-flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:0ms]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:150ms]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-bounce [animation-delay:300ms]"></span>
          </span>
        </h3>
        <p className="text-sm text-stone-600 font-medium h-6 transition-all duration-300">
          {COOKING_STEPS[stepIndex]}
        </p>
      </div>

      {/* Visual Progress Bar */}
      <div className="w-64 sm:w-80 h-2 bg-stone-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full"
          initial={{ width: '15%' }}
          animate={{ width: ['15%', '50%', '85%', '98%'] }}
          transition={{ duration: 2.2, ease: 'easeInOut' }}
        />
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/60">
        <Utensils className="w-3.5 h-3.5" />
        <span>Optimizing dietary preferences & portions</span>
      </div>
    </div>
  );
};
