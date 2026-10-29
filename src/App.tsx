import React, { useState, useEffect } from 'react';
import { PageView, Recipe } from './types/recipe';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeatureCards } from './components/FeatureCards';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { GeneratorForm } from './components/GeneratorForm';
import { PantryPage } from './components/PantryPage';
import { RecipeResults } from './components/RecipeResults';
import { RecipeDetail } from './components/RecipeDetail';
import { AboutModal } from './components/AboutModal';
import { ContactModal } from './components/ContactModal';
import { getRecipes } from './services/api';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_PANTRY_ITEMS = [
  'Tomato',
  'Onion',
  'Potato',
  'Paneer',
  'Spinach',
  'Eggs',
  'Garlic',
  'Butter',
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageView>('landing');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(['paneer-tikka-masala']);
  const [error, setError] = useState<string | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Persistent pantry state in browser localStorage
  const [pantryIngredients, setPantryIngredients] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recipix_pantry') || localStorage.getItem('cuisinecraft_pantry');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to parse pantry from localStorage:', e);
    }
    return DEFAULT_PANTRY_ITEMS;
  });

  // Sync pantry to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('recipix_pantry', JSON.stringify(pantryIngredients));
    } catch (e) {
      console.error('Failed to save pantry to localStorage:', e);
    }
  }, [pantryIngredients]);

  const handleAddPantryIngredient = (name: string) => {
    setPantryIngredients((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === name.toLowerCase());
      if (exists) return prev;
      return [...prev, name];
    });
  };

  const handleRemovePantryIngredient = (name: string) => {
    setPantryIngredients((prev) =>
      prev.filter((item) => item.toLowerCase() !== name.toLowerCase())
    );
  };

  const handleResetDefaultPantry = () => {
    setPantryIngredients(DEFAULT_PANTRY_ITEMS);
  };

  // Load initial recipes on mount
  useEffect(() => {
    async function loadInitial() {
      try {
        const data = await getRecipes();
        setRecipes(data);
      } catch (err: any) {
        console.error('Failed to load initial recipes:', err);
      }
    }
    loadInitial();
  }, []);

  const handleNavigate = (page: PageView) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecipeGenerated = (newRecipe: Recipe) => {
    setRecipes((prev) => [newRecipe, ...prev]);
    setSelectedRecipe(newRecipe);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleSave = (recipeId: string) => {
    setSavedRecipeIds((prev) =>
      prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* Responsive Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        savedCount={savedRecipeIds.length}
      />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {currentPage === 'landing' && (
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <Hero
                onStartGenerating={() => handleNavigate('generator')}
                onExploreRecipes={() => handleNavigate('results')}
              />

              {/* Feature Cards Section */}
              <FeatureCards />

              {/* FAQ Section */}
              <FAQ />
            </motion.div>
          )}

          {currentPage === 'generator' && (
            <motion.div
              key="generator-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-8 sm:py-14 px-4 sm:px-6 lg:px-8"
            >
              <GeneratorForm
                onRecipeGenerated={handleRecipeGenerated}
                onError={(msg) => setError(msg)}
                pantryIngredients={pantryIngredients}
                onNavigateToPantry={() => handleNavigate('pantry')}
              />
            </motion.div>
          )}

          {currentPage === 'pantry' && (
            <motion.div
              key="pantry-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PantryPage
                ingredients={pantryIngredients}
                onAddIngredient={handleAddPantryIngredient}
                onRemoveIngredient={handleRemovePantryIngredient}
                onResetDefault={handleResetDefaultPantry}
                onNavigateToGenerator={() => handleNavigate('generator')}
              />
            </motion.div>
          )}

          {currentPage === 'results' && (
            <motion.div
              key="results-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RecipeResults
                recipes={recipes}
                onViewDetails={handleViewDetails}
                onGoToGenerator={() => handleNavigate('generator')}
                error={error}
                onClearError={() => setError(null)}
                savedRecipeIds={savedRecipeIds}
                onToggleSave={handleToggleSave}
              />
            </motion.div>
          )}

          {currentPage === 'details' && selectedRecipe && (
            <motion.div
              key="details-page"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <RecipeDetail
                recipe={selectedRecipe}
                onBack={() => handleNavigate('results')}
                isSaved={savedRecipeIds.includes(selectedRecipe.id)}
                onToggleSave={handleToggleSave}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenContact={() => setContactOpen(true)}
      />

      {/* Modals */}
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
