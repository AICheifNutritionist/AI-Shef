import React, { useRef } from 'react';
import { Recipe } from '../types';
import { RecipeDisplay } from './RecipeDisplay';
import { ChevronLeft, ChevronRight } from './Icons';

interface RecipeCarouselProps {
  recipes: Recipe[];
  availableIngredients: string[];
}

export const RecipeCarousel: React.FC<RecipeCarouselProps> = ({
  recipes,
  availableIngredients,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-8 animate-fade-in max-w-4xl mx-auto overflow-hidden">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6 text-center px-3 md:px-4">
        Ваши персональные рецепты
      </h2>

      <div className="flex justify-center items-center gap-2 md:gap-4 mb-4 md:mb-6 px-3 md:px-4">
        <button
          onClick={scrollLeft}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 shadow-lg flex-shrink-0"
          aria-label="Предыдущий рецепт"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        <span className="text-gray-600 font-medium text-xs md:text-sm lg:text-base text-center">
          <span className="hidden md:inline">Используйте кнопки или прокрутите для просмотра</span>
          <span className="md:hidden">Прокрутите →</span>
        </span>

        <button
          onClick={scrollRight}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 md:p-3 transition-all duration-200 hover:scale-110 shadow-lg flex-shrink-0"
          aria-label="Следующий рецепт"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-4 md:space-x-8 pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-100 px-3 md:px-4"
      >
        {recipes.map((recipe, index) => (
          <div key={index} className="flex-shrink-0 w-full snap-center">
            <RecipeDisplay recipe={recipe} availableIngredients={availableIngredients} />
          </div>
        ))}
      </div>
    </div>
  );
};
