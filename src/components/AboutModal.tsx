import React from 'react';
import { X, ChefHat, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200/90 max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Close Button */}
        <button
          id="close-about-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900">
              About Recipix
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Smart Recipe Generator
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
          <p>
            Recipix is a simple AI-powered recipe generator that can identify ingredients from an uploaded image and generate recipes using the ingredients available to the user.
          </p>
          <p>
            Simply snap a photo of your fridge or pantry, or manage your kitchen inventory in the Pantry. Recipix automatically detects available ingredients and crafts step-by-step recipes tailored to your cuisine preferences, dietary requirements, and desired servings.
          </p>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-2.5">
            <h4 className="font-bold font-heading text-stone-900 text-sm">
              Our Core Principles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero food waste advocacy</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Strict Jain & Vegan compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Calibrated culinary chemistry</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Nutritional macro precision</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            id="about-got-it-btn"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
