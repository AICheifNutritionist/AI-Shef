import { useMutation } from '@tanstack/react-query';
import { recipeApi } from '../api/recipeApi';
import type { Recipe, RecipeRequest } from '../types';

export const useGenerateRecipes = () => {
  return useMutation<Recipe[], Error, RecipeRequest>({
    mutationFn: recipeApi.generateRecipes,
    retry: 1,
    retryDelay: 1000,
  });
};
