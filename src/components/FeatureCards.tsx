import React from 'react';
import { Camera, SlidersHorizontal, Scale, Activity, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface FeatureItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  badge: string;
  accentColor: string;
  badgeColor: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'feature-vision',
    icon: Camera,
    title: 'Smart Ingredient Vision',
    description: 'Snap a picture of your pantry, produce basket, or open refrigerator. Our intelligent vision engine identifies ingredients automatically with high precision.',
    badge: 'Multimodal AI',
    accentColor: 'from-amber-500 to-orange-500',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200/60'
  },
  {
    id: 'feature-dietary',
    icon: SlidersHorizontal,
    title: 'Strict Dietary Filters',
    description: 'Whether you follow strict Jain principles (no root vegetables, onion, or garlic), plant-based Vegan, High Protein, or Gluten-Free, we tailor every recipe strictly to your needs.',
    badge: '100% Compliant',
    accentColor: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200/60'
  },
  {
    id: 'feature-waste',
    icon: Scale,
    title: 'Zero Food Waste Engine',
    description: 'Transform odds and ends into culinary masterpieces. Reduce household grocery waste by up to 40% with smart ingredient pairings and pantry substitutions.',
    badge: 'Eco-Friendly',
    accentColor: 'from-orange-500 to-amber-600',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200/60'
  },
  {
    id: 'feature-nutrition',
    icon: Activity,
    title: 'Precision Nutrition & Macros',
    description: 'Receive immediate calculated nutritional breakdowns including calories, grams of protein, net carbohydrates, dietary fiber, and healthy fats for every generated dish.',
    badge: 'Health-First',
    accentColor: 'from-sky-500 to-indigo-600',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200/60'
  }
];

export const FeatureCards: React.FC = () => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 text-stone-800 text-xs font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Cutting-Edge Cooking</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
            Designed for Passionate Cooks & Busy Lifestyles
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            Everything you need to turn raw pantry items into restaurant-quality meals in minutes, without culinary guesswork.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.id}
                id={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/90 shadow-sm hover:shadow-xl hover:shadow-stone-900/5 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.accentColor} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold font-heading text-stone-900 mb-2.5 group-hover:text-amber-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
