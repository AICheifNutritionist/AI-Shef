import React from 'react';
import { ChefHat } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center gap-4">
        <ChefHat className="w-10 h-10 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">AI-шеф</h1>
          <p className="text-gray-500">Ваш персональный ассистент по рецептам</p>
        </div>
      </div>
    </header>
  );
};
