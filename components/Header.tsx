import React from 'react';
import { ChefHat } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from './UserProfile';

export const Header: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        <div className="flex items-start gap-2 md:gap-4">
          <ChefHat className="w-8 h-8 md:w-12 md:h-12 text-green-600 flex-shrink-0" />

          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">AI-шеф</h1>

            <p className="text-xs md:text-base text-gray-500 hidden sm:block">
              Ваш персональный ассистент по рецептам
            </p>
          </div>
        </div>

        {isAuthenticated && <UserProfile />}
      </div>
    </header>
  );
};
