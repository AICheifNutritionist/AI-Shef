import React from 'react';
import type { Recipe } from '../types';
import { Clock, DollarSign, HeartPulse, Utensils, ShoppingCart, CheckCircle } from './Icons';

interface RecipeDisplayProps {
  recipe: Recipe;
  availableIngredients: string[];
}

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center text-center bg-green-50 p-4 rounded-lg">
        <div className="text-green-600 mb-2">{icon}</div>
        <span className="text-sm text-gray-500">{label}</span>
        <span className="font-bold text-gray-800">{value}</span>
    </div>
);

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      <img src={recipe.imageUrl} alt={recipe.recipeName} className="w-full h-64 object-cover" />
      
      <div className="p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{recipe.recipeName}</h2>
        <p className="text-gray-600 mb-6">{recipe.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <InfoCard icon={<Clock className="w-8 h-8"/>} label="Время" value={recipe.cookingTime} />
            <InfoCard icon={<DollarSign className="w-8 h-8"/>} label="Стоимость" value={recipe.estimatedCost} />
            <InfoCard icon={<HeartPulse className="w-8 h-8"/>} label="Калории" value={recipe.nutrition.calories} />
            <InfoCard icon={<Utensils className="w-8 h-8"/>} label="Белки" value={recipe.nutrition.protein} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Ингредиенты</h3>
                <ul className="space-y-2">
                    {recipe.ingredients.map((ing, index) => (
                        <li key={index} className={`flex items-start gap-3 p-2 rounded-md ${ing.status === 'have' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                            {ing.status === 'have' 
                                ? <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1"/> 
                                : <ShoppingCart className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1"/>
                            }
                            <div>
                                <span className="font-medium text-gray-800">{ing.name}</span>
                                <span className="text-gray-500"> - {ing.amount}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-700">Инструкции</h3>
                <ol className="space-y-4">
                    {recipe.instructions.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-8 h-8 bg-green-600 text-white font-bold rounded-full flex items-center justify-center">{index + 1}</span>
                            <p className="text-gray-700 pt-1">{step}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </div>

        <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Необходимая посуда</h3>
            <div className="flex flex-wrap gap-3">
                {recipe.kitchenware.map((item, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{item}</span>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};