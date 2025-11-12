import type { Recipe, RecipeRequest } from '../types';
import apiClient from '@/services/apiClient';
import { URLS } from './urls';

export const recipeApi = {
  generateRecipes: async (params: RecipeRequest): Promise<Recipe[]> => {
    const response = await apiClient.post<Recipe[]>(URLS.CHEF, params);

    return response.data;
  },
};
