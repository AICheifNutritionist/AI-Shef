import type { Recipe, RecipeRequest } from '../types';
import apiClient from '@/services/apiClient';
import { URLS } from './urls';

export interface RecipeApiResponse {
  recipes: Recipe[];
}

export const recipeApi = {
  generateRecipes: async (params: RecipeRequest): Promise<Recipe[]> => {
    const response = await apiClient.post<RecipeApiResponse>(URLS.CHEF, params);

    return response.data.recipes;
  },
};
