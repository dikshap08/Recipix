import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'How does the AI generate recipes from my ingredients?',
    answer: 'Our culinary AI analyzes the flavor affinities, cooking techniques, and moisture balances of your input ingredients. It then cross-references hundreds of thousands of culinary pairings to synthesize a bespoke recipe with calibrated cooking times, step-by-step guidance, and balanced seasoning.'
  },
  {
    question: 'Can I upload a photo of my open fridge or pantry?',
    answer: 'Yes! The image upload tool allows you to upload photos (JPEG, PNG, WEBP) directly. The system identifies visible produce, dairy, proteins, and pantry staples, automatically populating them for your recipe generation.'
  },
  {
    question: 'Does the generator support strict Jain or Vegan preferences?',
    answer: 'Absolutely. We have dedicated dietary filters for Jain (strictly eliminating onions, garlic, potatoes, carrots, and other root vegetables), Vegan (100% plant-based, no dairy or honey), High Protein, and Gluten-Free lifestyles.'
  },
  {
    question: 'How are cooking times and nutritional facts calculated?',
    answer: 'Nutritional estimates (calories, protein, carbohydrates, fats, fiber, sodium) and cooking durations are dynamically computed based on USDA nutrient data models scaled to your selected number of servings.'
  },
  {
    question: 'Can I scale the recipe servings dynamically?',
    answer: 'Yes! When viewing any recipe details, you can use the interactive portion controller (1 to 8+ servings). The ingredient quantities update dynamically to ensure exact measurements.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/70 text-stone-800 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-stone-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-stone-600 text-sm sm:text-base">
          Everything you need to know about our smart AI culinary engine.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden transition-all shadow-sm hover:border-amber-300/80"
            >
              <button
                id={`faq-btn-${idx}`}
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-heading font-semibold text-stone-900 text-base sm:text-lg focus:outline-none focus-visible:bg-stone-50"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
