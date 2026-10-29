import React from 'react';
import { Sparkles, ArrowRight, Clock, Flame, Utensils, CheckCircle2, Heart, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onStartGenerating: () => void;
  onExploreRecipes: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartGenerating, onExploreRecipes }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background ambient warm glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-amber-200/40 via-orange-200/30 to-emerald-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Next-Gen Culinary Intelligence</span>
            </div>

            {/* Main Headline & Short Tagline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-stone-900 tracking-tight leading-[1.12]">
              Turn Ingredients Into{' '}
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                Delicious Recipes
              </span>{' '}
              Using AI.
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Never wonder what to cook again. Snap a photo of your fridge or list what’s in your pantry, and our AI instantly crafts step-by-step gourmet recipes tailored to your dietary choices, cuisine preferences, and exact portion sizes.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="hero-generate-cta"
                onClick={onStartGenerating}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-base shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 group cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span>Generate Recipe Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-explore-cta"
                onClick={onExploreRecipes}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-base border border-stone-300/80 hover:border-stone-400 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4 text-stone-500" />
                <span>Explore Community Favorites</span>
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs sm:text-sm text-stone-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero food waste</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Jain & Vegan options</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Instant nutritional breakdown</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Attractive Food Illustration & Interactive Card Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="lg:col-span-5 relative"
          >
            {/* Main Featured Showcase Card */}
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl shadow-stone-900/10 border border-stone-200/80">
              
              {/* Card Image Placeholder / Rich Culinary Artwork */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80"
                  alt="AI Generated Fresh Food Bowl"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Match Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-stone-100">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="text-xs font-bold text-stone-800">99% Ingredient Match</span>
                </div>

                {/* Dietary badge */}
                <div className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm">
                  Vegetarian & High Protein
                </div>
              </div>

              {/* Recipe Quick Details */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600">AI Suggested</span>
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-stone-900 leading-snug">
                      Szechuan Crispy Tofu & Edamame Bowl
                    </h3>
                  </div>
                  <button 
                    id="hero-sample-favorite"
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                    aria-label="Save Recipe"
                  >
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 line-clamp-2">
                  Golden cornstarch-crusted tofu tossed in a spicy, tingling Szechuan chili glaze with steamed edamame, baby bok choy, and toasted sesame.
                </p>

                {/* Metrics */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs font-semibold text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>20 mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>380 kcal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Easy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="hidden sm:flex absolute -bottom-5 -left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-stone-100 items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Pantry detected</p>
                <p className="text-sm font-bold text-stone-800">5 Ingredients Recognized</p>
              </div>
            </div>

            <div className="hidden sm:flex absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-stone-100 items-center gap-2 z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></div>
              <p className="text-xs font-bold text-stone-700">Ready in 2.2 seconds</p>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
