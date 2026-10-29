export type DietaryPreference =
  | 'Vegetarian'
  | 'Vegan'
  | 'High Protein'
  | 'Gluten Free'
  | 'Jain'
  | 'No Preference';

export type CuisineType =
  | 'Indian'
  | 'Italian'
  | 'Chinese'
  | 'Mexican'
  | 'American'
  | 'Continental'
  | 'Any';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface IngredientItem {
  id: string;
  name: string;
  amount: string;
  unit?: string;
  notes?: string;
}

export interface InstructionStep {
  step: number;
  title?: string;
  text: string;
  timeEstimate?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  fiber: string;
  sugar?: string;
  sodium?: string;
}

export interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: string;
  prepTime: string;
  difficulty: DifficultyLevel;
  calories: number;
  cuisine: CuisineType;
  dietary: DietaryPreference[];
  shortDescription: string;
  servings: number;
  ingredients: IngredientItem[];
  instructions: InstructionStep[];
  tips: string[];
  nutrition: NutritionInfo;
  tags: string[];
  matchScore?: number;
  authorOrSource?: string;
}

export interface RecipeGenerationParams {
  imageFile?: File | null;
  imagePreviewUrl?: string | null;
  ingredientsText: string;
  dietaryPreference: DietaryPreference;
  cuisine: CuisineType;
  servings: number;
}

export interface RecipeFilterState {
  searchQuery: string;
  cuisine: CuisineType | 'All';
  dietary: DietaryPreference | 'All';
  difficulty: DifficultyLevel | 'All';
  maxTime: number; // in minutes (0 = any)
}

export type PageView = 'landing' | 'generator' | 'results' | 'details' | 'pantry';
