import React, { useState } from 'react';
import { PlusCircle, XCircle } from './Icons';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({
  ingredients,
  setIngredients,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = () => {
    if (!inputValue.trim()) return;

    const existingIngredientsLower = ingredients.map(i => i.toLowerCase());

    const newIngredients = inputValue
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '')
      .filter(item => !existingIngredientsLower.includes(item.toLowerCase()));

    if (newIngredients.length > 0) {
      const uniqueNewIngredients = [...new Set(newIngredients)];
      setIngredients(prevIngredients => [...prevIngredients, ...uniqueNewIngredients]);
    }

    setInputValue('');
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient !== ingredientToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 overflow-hidden">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700">
        Что в холодильнике?
      </h2>
      <div className="flex gap-1.5 sm:gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="хлеб, помидоры..."
          className="flex-grow p-2.5 sm:p-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow min-w-0"
        />
        <button
          onClick={handleAddIngredient}
          className="flex-shrink-0 p-2.5 sm:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors disabled:bg-gray-400 min-w-[44px] sm:min-w-[48px] min-h-[44px] sm:min-h-[48px]"
          disabled={!inputValue.trim()}
          aria-label="Добавить ингредиенты"
        >
          <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2 -mr-1">
        {ingredients.map((ingredient, index) => (
          <div
            key={index}
            className="flex items-center gap-1.5 sm:gap-2 bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full animate-fade-in"
          >
            <span className="leading-none">{ingredient}</span>
            <button
              onClick={() => handleRemoveIngredient(ingredient)}
              className="text-green-600 hover:text-green-800 active:text-green-900 p-0.5 min-w-[20px] min-h-[20px] flex items-center justify-center"
              aria-label={`Удалить ${ingredient}`}
            >
              <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
