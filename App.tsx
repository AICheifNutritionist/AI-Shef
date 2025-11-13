import React, { useState } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeOptions } from './components/RecipeOptions';
import { RecipeCarousel } from './components/RecipeCarousel';
import { Loader } from './components/Loader';
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

      <main className="container mx-auto px-2 sm:px-3 py-3 sm:py-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 lg:p-8 space-y-5 sm:space-y-6 md:space-y-8 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
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
              className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-green-600 text-white font-bold text-base md:text-lg rounded-full shadow-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 md:focus:ring-4 focus:ring-green-300 w-full sm:w-auto max-w-full"
            >
              <ChefHat className="w-5 h-5 md:w-6 md:h-6" />

              {isPending ? 'Творим волшебство...' : 'Создать 3 рецепта'}
            </button>
          </div>

          {error && (
            <div className="text-center text-red-600 bg-red-100 p-3 sm:p-4 rounded-lg text-sm md:text-base">
              {error.message || 'Произошла ошибка при генерации рецептов'}
            </div>
          )}
        </div>

        {isPending && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="w-full max-w-[90vw] sm:max-w-md aspect-square bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
              <Loader />
              <p className="text-center text-gray-600 mt-2 sm:mt-4 font-medium text-sm sm:text-base">
                Генерируем рецепты...
              </p>
            </div>
          </div>
        )}

        {recipes && !isPending && (
          <RecipeCarousel recipes={recipes} availableIngredients={ingredients} />
        )}

        {!recipes && !isPending && (
          <div className="text-center py-8 sm:py-12 md:py-16 text-gray-400 max-w-4xl mx-auto px-3 sm:px-4">
            <p className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2">
              Ваши кулинарные шедевры ждут...
            </p>

            <p className="text-xs sm:text-sm md:text-base">
              Добавьте ингредиенты, и наш AI-шеф предложит вам несколько идей!
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-3 sm:py-4 md:py-6 text-[10px] sm:text-xs md:text-sm text-gray-500 px-3 sm:px-4">
        <p className="max-w-4xl mx-auto">
          Работает на Gemini. Разработано ведущим фронтенд-инженером мирового класса.
        </p>
      </footer>
    </div>
  );
};

export default App;
