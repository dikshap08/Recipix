import React, { useState } from 'react';
import { ChefHat, Sparkles, Menu, X, ArrowRight, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { PageView } from '../types/recipe';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenAbout: () => void;
  onOpenContact?: () => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenAbout,
  onOpenContact,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: PageView) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold font-heading tracking-tight text-stone-900 group-hover:text-amber-600 transition-colors">
                Recipix
              </span>
              <p className="text-xs text-stone-500 font-medium hidden sm:block">Smart Recipe Generator</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick('landing')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === 'landing'
                  ? 'text-amber-700 bg-amber-50/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Home
            </button>

            <a
              id="nav-link-features"
              href="#features"
              onClick={(e) => {
                if (currentPage !== 'landing') {
                  e.preventDefault();
                  onNavigate('landing');
                  setTimeout(() => {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100/60 transition-colors"
            >
              Features
            </a>

            <button
              id="nav-link-recipes"
              onClick={() => handleNavClick('results')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === 'results'
                  ? 'text-amber-700 bg-amber-50/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Explore Recipes
            </button>

            <button
              id="nav-link-pantry"
              onClick={() => handleNavClick('pantry')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                currentPage === 'pantry'
                  ? 'text-amber-700 bg-amber-50/80'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              Pantry
            </button>

            <button
              id="nav-link-about"
              onClick={onOpenAbout}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100/60 transition-colors"
            >
              About
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              id="nav-generate-btn"
              onClick={() => handleNavClick('generator')}
              className={`relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
                currentPage === 'generator'
                  ? 'bg-amber-600 text-white shadow-amber-600/30'
                  : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow-md'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate Recipe</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="nav-mobile-generate-btn"
              onClick={() => handleNavClick('generator')}
              className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Generate
            </button>
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FAF7F2] px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          <button
            id="mobile-link-home"
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm ${
              currentPage === 'landing' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700'
            }`}
          >
            Home
          </button>
          <button
            id="mobile-link-generator"
            onClick={() => handleNavClick('generator')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-between ${
              currentPage === 'generator' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Recipe Generator
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>
          <button
            id="mobile-link-results"
            onClick={() => handleNavClick('results')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-between ${
              currentPage === 'results' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-600" />
              Explore Recipes
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>
          <button
            id="mobile-link-pantry"
            onClick={() => handleNavClick('pantry')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-between ${
              currentPage === 'pantry' ? 'bg-amber-100/70 text-amber-900 font-semibold' : 'text-stone-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              Pantry
            </span>
            <ArrowRight className="w-4 h-4 text-stone-400" />
          </button>
          <button
            id="mobile-link-about"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAbout();
            }}
            className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm text-stone-700 hover:bg-stone-100"
          >
            About
          </button>
        </div>
      )}
    </header>
  );
};
