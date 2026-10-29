import React, { useState } from 'react';
import { ChefHat, Heart, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageView } from '../types/recipe';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAbout, onOpenContact }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-heading text-white tracking-tight">
                Recipix
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
              Recipix is a simple AI-powered recipe generator that can identify ingredients from an uploaded image and generate recipes using the ingredients available to you.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 pt-2">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
              <span>for food lovers everywhere</span>
            </div>
          </div>

          {/* Col: Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Platform
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  id="footer-nav-home"
                  onClick={() => onNavigate('landing')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-generator"
                  onClick={() => onNavigate('generator')}
                  className="hover:text-amber-400 transition-colors"
                >
                  AI Recipe Generator
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-explore"
                  onClick={() => onNavigate('results')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Explore Recipes
                </button>
              </li>
              <li>
                <button
                  id="footer-nav-pantry"
                  onClick={() => onNavigate('pantry')}
                  className="hover:text-amber-400 transition-colors"
                >
                  My Pantry
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-amber-400 transition-colors">
                  Core Features
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col: Cuisines & Diets */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Cuisines & Diets
            </h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Indian & Jain Culinary</li>
              <li>Artisan Italian Pasta & Risottos</li>
              <li>Crispy Szechuan & Wok Specials</li>
              <li>Authentic Mexican Taqueria</li>
              <li>High-Protein & Meal-Prep Bowls</li>
            </ul>
          </div>

          {/* Col: Newsletter & Updates */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Culinary Newsletter
            </h4>
            <p className="text-xs text-stone-400">
              Get weekly seasonal recipe suggestions and zero-waste cooking tips directly to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  id="footer-newsletter-input"
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-stone-800 text-white placeholder-stone-500 text-sm border border-stone-700 focus:outline-none focus:border-amber-500"
                />
                <button
                  id="footer-newsletter-btn"
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors flex items-center justify-center cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox soon.</span>
                </div>
              )}
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Recipix. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button id="footer-about-btn" onClick={onOpenAbout} className="hover:text-stone-300 transition-colors">
              About Us
            </button>
            <span className="text-stone-600">|</span>
            <span className="text-stone-400">Isolated API Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
