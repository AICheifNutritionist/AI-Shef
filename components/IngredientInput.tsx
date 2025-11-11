import React, { useState } from 'react';
import { PlusCircle, XCircle } from './Icons';

interface IngredientInputProps {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
}

export const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients }) => {
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
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Что в вашем холодильнике?</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="хлеб, помидоры, сыр..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
        />
        <button
          onClick={handleAddIngredient}
          className="flex-shrink-0 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          disabled={!inputValue.trim()}
          aria-label="Добавить ингредиенты"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2 pt-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full animate-fade-in">
            <span>{ingredient}</span>
            <button onClick={() => handleRemoveIngredient(ingredient)} className="text-green-600 hover:text-green-800" aria-label={`Удалить ${ingredient}`}>
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};