export interface RecipeRequest {
  ingredients: string[];
  mealType: string;
  cookingTime: number;
  preferences: string[];
  dietaryNeeds: string[];
  willingToShop: boolean;
  shoppingBudget: number;
}

export interface Nutrition {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  status: 'have' | 'need';
}

export interface Recipe {
  recipeName: string;
  description: string;
  cookingTime: string;
  estimatedCost: string;
  nutrition: Nutrition;
  ingredients: Ingredient[];
  instructions: string[];
  kitchenware: string[];
  imageUrl: string;
}
