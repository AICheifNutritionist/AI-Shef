import React from 'react';
import { ChefHat } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from './UserProfile';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-4 flex items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 min-w-0 flex-1">
          <ChefHat className="w-7 h-7 sm:w-8 sm:h-8 md:w-12 md:h-12 text-green-600 flex-shrink-0" />

          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-800 truncate leading-tight">
              AI-шеф
            </h1>

            <p className="text-[10px] sm:text-xs md:text-base text-gray-500 hidden sm:block truncate leading-tight">
              Ваш персональный ассистент по рецептам
            </p>
          </div>
        </div>

        {isAuthenticated && <UserProfile />}
      </div>
    </header>
  );
};
