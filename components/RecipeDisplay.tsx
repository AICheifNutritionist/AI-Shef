import React from 'react';
import type { Recipe } from '../types';
import { Clock, DollarSign, Fire, Restaurant, ShoppingCart, CheckCircle } from './Icons';

interface RecipeDisplayProps {
  recipe: Recipe;
  availableIngredients: string[];
}

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex flex-col items-center text-center bg-green-50 p-2 sm:p-3 md:p-4 rounded-md md:rounded-lg">
    <div className="text-green-600 mb-1 md:mb-2">{icon}</div>

    <span className="text-[10px] sm:text-xs md:text-sm text-gray-500 leading-tight">{label}</span>

    <span className="font-bold text-xs sm:text-sm md:text-base text-gray-800">{value}</span>
  </div>
);

export const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-gray-200">
      <img
        src={recipe.photo}
        alt={recipe.recipeName}
        className="w-full h-44 xs:h-48 sm:h-56 md:h-64 object-cover"
      />

      <div className="p-3 sm:p-4 md:p-6 lg:p-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-1.5 sm:mb-2 leading-tight">
          {recipe.recipeName}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6 line-clamp-3">
          {recipe.description}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 md:gap-4 mb-4 sm:mb-6 md:mb-8">
          <InfoCard
            icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
            label="Время"
            value={recipe.cookingTime}
          />

          <InfoCard
            icon={<DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
            label="Стоимость"
            value={recipe.estimatedCost}
          />

          <InfoCard
            icon={<Fire className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
            label="Калории"
            value={recipe.nutrition.calories}
          />

          <InfoCard
            icon={<Restaurant className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />}
            label="Белки"
            value={recipe.nutrition.protein}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-700">
              Ингредиенты
            </h3>

            <ul className="space-y-1.5 sm:space-y-2">
              {recipe.ingredients.map((ing, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-1.5 sm:gap-2 md:gap-3 p-1.5 sm:p-2 rounded-md ${ing.status === 'have' ? 'bg-blue-50' : 'bg-yellow-50'}`}
                >
                  {ing.status === 'have' ? (
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                  ) : (
                    <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                  )}
                  <div className="text-xs sm:text-sm md:text-base min-w-0">
                    <span className="font-medium text-gray-800">{ing.name}</span>

                    <span className="text-gray-500"> - {ing.amount}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-700">
              Инструкции
            </h3>

            <ol className="space-y-2 sm:space-y-3 md:space-y-4">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-green-600 text-white text-xs sm:text-sm md:text-base font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>

                  <p className="text-xs sm:text-sm md:text-base text-gray-700 pt-0 sm:pt-0.5 md:pt-1 min-w-0">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 md:mt-8 border-t pt-3 sm:pt-4 md:pt-6">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-700">
            Необходимая посуда
          </h3>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 -mr-1">
            {recipe.kitchenware.map((item, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
