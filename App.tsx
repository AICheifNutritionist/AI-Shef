
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { IngredientInput } from './components/IngredientInput';
import { RecipeOptions } from './components/RecipeOptions';
import { RecipeDisplay } from './components/RecipeDisplay';
import { Loader } from './components/Loader';
import { generateRecipeAndImage } from './services/geminiService';
import type { Recipe, RecipeRequest } from './types';
import { ChefHat } from './components/Icons';
import { BudgetInput } from './components/BudgetInput';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['куриная грудка', 'рис', 'брокколи']);
  const [mealType, setMealType] = useState<string>('Ужин');
  const [cookingTime, setCookingTime] = useState<number>(30);
  const [preferences, setPreferences] = useState<string[]>(['Здоровое']);
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([]);
  const [willingToShop, setWillingToShop] = useState<boolean>(true);
  const [shoppingBudget, setShoppingBudget] = useState<number>(500);

  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = useCallback(async () => {
    if (ingredients.length === 0) {
      setError('Пожалуйста, добавьте хотя бы один ингредиент.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes(null);

    const request: RecipeRequest = {
      ingredients,
      mealType,
      cookingTime,
      preferences,
      dietaryNeeds,
      willingToShop,
      shoppingBudget,
    };

    try {
      const generatedRecipes = await generateRecipeAndImage(request);
      setRecipes(generatedRecipes);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, mealType, cookingTime, preferences, dietaryNeeds, willingToShop, shoppingBudget]);

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
              disabled={isLoading || ingredients.length === 0}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              <ChefHat className="w-6 h-6" />
              {isLoading ? 'Творим волшебство...' : 'Создать 3 рецепта'}
            </button>
          </div>

          {error && <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
        </div>

        {isLoading && <div className="max-w-4xl mx-auto"><Loader /></div>}

        {recipes && !isLoading && (
          <div className="mt-8 animate-fade-in max-w-4xl mx-auto">
             <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Ваши персональные рецепты</h2>
            <div className="flex overflow-x-auto space-x-8 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-100">
              {recipes.map((recipe, index) => (
                <div key={index} className="flex-shrink-0 w-full snap-center">
                  <RecipeDisplay recipe={recipe} availableIngredients={ingredients} />
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 mt-2 text-sm">Прокрутите вправо, чтобы увидеть больше вариантов →</p>
          </div>
        )}
        
        {!recipes && !isLoading && (
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
