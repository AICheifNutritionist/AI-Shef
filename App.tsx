import React, { useState } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeOptions } from './components/RecipeOptions';
import { RecipeCarousel } from './components/RecipeCarousel';
import { Loader } from './components/Loader';
import type { Recipe } from './types';
import { ChefHat } from './components/Icons';
import { BudgetInput } from './components/BudgetInput';
import { useAuth } from './contexts/AuthContext';
import { useGenerateRecipes } from './hooks/useRecipes';

// TODO: вынести в page м перенести сюда провайдеры
const App: React.FC = () => {
  const { isLoading: authLoading } = useAuth();
  // TODO: переписать это на работу с формой и обработать ошибки
  // TODO: Убрать предустановки в словари
  const [ingredients, setIngredients] = useState<string[]>(['куриная грудка', 'рис', 'брокколи']);
  const [mealType, setMealType] = useState<string>('Ужин');
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [preferences, setPreferences] = useState<string[]>(['Здоровое']);
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([]);
  const [willingToShop, setWillingToShop] = useState<boolean>(true);
  const [shoppingBudget, setShoppingBudget] = useState<number>(500);

  const { mutate: generateRecipes, data: recipes, isPending, error } = useGenerateRecipes();

  const handleGenerateRecipe = () => {
    if (ingredients.length === 0) {
      return;
    }

    generateRecipes({
      ingredients,
      mealType,
      cookingTime,
      preferences,
      dietaryNeeds,
      willingToShop,
      shoppingBudget,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />

      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <IngredientInput ingredients={ingredients} setIngredients={setIngredients} />

            <RecipeOptions
              mealType={mealType}
              setMealType={setMealType}
              cookingTime={cookingTime}
              setCookingTime={setCookingTime}
              preferences={preferences}
              setPreferences={setPreferences}
              dietaryNeeds={dietaryNeeds}
              setDietaryNeeds={setDietaryNeeds}
            />
          </div>

          <BudgetInput
            willingToShop={willingToShop}
            setWillingToShop={setWillingToShop}
            shoppingBudget={shoppingBudget}
            setShoppingBudget={setShoppingBudget}
          />

          <div className="text-center">
            <button
              onClick={handleGenerateRecipe}
              disabled={isPending || ingredients.length === 0}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <ChefHat className="w-6 h-6" />

              {isPending ? 'Творим волшебство...' : 'Создать 3 рецепта'}
            </button>
          </div>

          {error && (
            <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">
              {error.message || 'Произошла ошибка при генерации рецептов'}
            </div>
          )}
        </div>

        {isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-[400px] h-[400px] bg-white rounded-lg p-8 shadow-xl">
              <Loader />
              <p className="text-center text-gray-600 mt-4 font-medium">Генерируем рецепты...</p>
            </div>
          </div>
        )}

        {recipes && !isPending && (
          <RecipeCarousel recipes={recipes} availableIngredients={ingredients} />
        )}

        {!recipes && !isPending && (
          <div className="text-center py-16 text-gray-400 max-w-4xl mx-auto">
            <p className="text-xl">Ваши кулинарные шедевры ждут...</p>

            <p>Добавьте ингредиенты, и наш AI-шеф предложит вам несколько идей!</p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-sm text-gray-500">
        <p>Работает на Gemini. Разработано ведущим фронтенд-инженером мирового класса.</p>
      </footer>
    </div>
  );
};

export default App;
