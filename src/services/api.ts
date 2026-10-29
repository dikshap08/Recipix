import { Recipe, RecipeGenerationParams, CuisineType, DietaryPreference } from '../types/recipe';
import { INITIAL_RECIPES } from '../data/mockRecipes';

/**
 * =========================================================================
 * API SERVICE LAYER (services/api.ts)
 * =========================================================================
 * This isolated service file encapsulates all recipe generation and analysis requests.
 * Currently it operates with rich mock logic, realistic latency simulations, and dynamic
 * culinary synthesis so the application works seamlessly standalone.
 *
 * TO CONNECT A PYTHON FLASK BACKEND:
 * 1. Set BACKEND_URL = "http://localhost:5000" or your production endpoint.
 * 2. In generateRecipe(), replace the simulated delay with:
 *      const formData = new FormData();
 *      if (params.imageFile) formData.append('image', params.imageFile);
 *      formData.append('ingredients', params.ingredientsText);
 *      formData.append('cuisine', params.cuisine);
 *      formData.append('dietary', params.dietaryPreference);
 *      formData.append('servings', params.servings.toString());
 *      const response = await fetch(`${BACKEND_URL}/api/generate-recipe`, { method: 'POST', body: formData });
 *      return await response.json();
 * =========================================================================
 */

export const BACKEND_URL = 'http://localhost:5000';

// In-memory recipe store for generated recipes during the session
let recipeStore: Recipe[] = [...INITIAL_RECIPES];

/**
 * Simulates a realistic delay for network and AI generation
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Helper to generate a unique ID
 */
const generateId = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
};

/**
 * Real AI Recipe Generator endpoint
 * Sends ingredients, cuisine, dietary preference, and servings to the Flask backend
 * which calls the Gemini API to formulate an authentic recipe and fetch a matching image.
 */
export async function generateRecipe(params: RecipeGenerationParams): Promise<Recipe> {
  const formData = new FormData();
  if (params.imageFile) {
    formData.append('image', params.imageFile);
  }
  formData.append('ingredients', params.ingredientsText);
  formData.append('cuisine', params.cuisine);
  formData.append('dietary', params.dietaryPreference);
  formData.append('servings', params.servings.toString());

  // Try relative endpoint first (Express proxy), then direct backend URL
  const endpoints = ['/api/generate-recipe', `${BACKEND_URL}/api/generate-recipe`];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Unable to generate the recipe right now. Please try again.';
        try {
          const errData = await response.json();
          if (
            errData?.error &&
            !errData.error.toLowerCase().includes('key') &&
            !errData.error.toLowerCase().includes('traceback')
          ) {
            errorMsg = errData.error;
          }
        } catch {
          // ignore JSON parsing issue
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      // Adapt structured backend response into complete Recipe object
      const recipe: Recipe = {
        id: data.id || `recipe-${Date.now().toString(36)}`,
        title: data.name || data.title || 'Generated Recipe',
        image: data.image || data.imageUrl || '',
        cookingTime: data.cookingTime || data.cookTime || '20 mins',
        prepTime: data.prepTime || '10 mins',
        difficulty: (data.difficulty as any) || 'Easy',
        calories: data.nutrition?.calories || data.calories || 350,
        cuisine: (data.cuisine as CuisineType) || (params.cuisine !== 'Any' ? params.cuisine : 'Indian'),
        dietary: Array.isArray(data.dietary)
          ? data.dietary
          : data.dietaryInfo
          ? [data.dietaryInfo as DietaryPreference]
          : [params.dietaryPreference],
        shortDescription:
          data.description ||
          data.shortDescription ||
          'A delicious recipe crafted from your ingredients.',
        servings: Number(data.servings) || params.servings || 2,
        ingredients: Array.isArray(data.ingredients)
          ? data.ingredients.map((ing: any, i: number) => ({
              id: ing.id || `ing-${i + 1}`,
              name: typeof ing === 'string' ? ing : ing.name || 'Ingredient',
              amount:
                typeof ing === 'object'
                  ? ing.amount || ing.quantity || '1 portion'
                  : '1 portion',
              unit: ing.unit,
            }))
          : [],
        instructions: Array.isArray(data.instructions)
          ? data.instructions.map((step: any, i: number) => {
              if (typeof step === 'string') {
                return {
                  step: i + 1,
                  title: `Step ${i + 1}`,
                  text: step,
                };
              }
              return {
                step: step.step || i + 1,
                title: step.title || `Step ${i + 1}`,
                text: step.text || step.instruction || '',
                timeEstimate: step.timeEstimate,
              };
            })
          : [],
        tips: Array.isArray(data.tips)
          ? data.tips
          : [
              'Taste and adjust seasoning before serving.',
              'Serve fresh and hot for the best flavor experience.',
            ],
        nutrition: data.nutrition || {
          calories: 350,
          protein: '16g',
          carbs: '30g',
          fat: '14g',
          fiber: '4g',
          sodium: '380mg',
        },
        tags: Array.isArray(data.tags)
          ? data.tags
          : ['AI Generated', params.cuisine],
        matchScore: data.matchScore || 98,
        authorOrSource: data.authorOrSource || 'Recipix Gemini AI Chef',
      };

      // Add to top of session library
      recipeStore = [recipe, ...recipeStore];
      return recipe;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Recipix API] Request to ${endpoint} failed:`, err?.message);
    }
  }

  throw lastError || new Error('Unable to generate the recipe right now. Please try again.');
}

/**
 * Fetch all available recipes
 */
export async function getRecipes(): Promise<Recipe[]> {
  await delay(150);
  return [...recipeStore];
}

/**
 * Fetch single recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  await delay(100);
  return recipeStore.find((r) => r.id === id) || null;
}

/**
 * Genuine Gemini Multimodal Ingredient Detection via Flask backend
 * Sends the image as multipart/form-data to the backend.
 * The backend analyzes the actual image with Gemini and returns { ingredients: string[] }.
 */
export async function analyzeImageIngredients(file: File): Promise<string[]> {
  const formData = new FormData();
  formData.append('image', file);

  // Try relative endpoint first (works through Express/Vite proxy), fallback to direct BACKEND_URL
  const endpoints = ['/api/analyze-ingredients', `${BACKEND_URL}/api/analyze-ingredients`];
  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMsg = 'Unable to analyze the image. Please try again.';
        try {
          const errData = await response.json();
          if (errData?.error && !errData.error.toLowerCase().includes('key')) {
            errorMsg = errData.error;
          }
        } catch {
          // ignore JSON parsing issue
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (Array.isArray(data.ingredients)) {
        return data.ingredients;
      }
      return [];
    } catch (err: any) {
      lastError = err;
      console.warn(`[Recipix API] Request to ${endpoint} failed:`, err?.message);
    }
  }

  throw lastError || new Error('Unable to analyze the image. Please try again.');
}
