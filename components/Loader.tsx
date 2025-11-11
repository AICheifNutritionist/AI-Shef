import React, { useState, useEffect } from 'react';
import { ChefHat } from './Icons';

const loadingMessages = [
  'Советуемся с кулинарными экспертами...',
  'Разогреваем AI-духовки...',
  'Подбираем идеальное сочетание специй...',
  'Ищем самые свежие виртуальные ингредиенты...',
  'Томим креативные идеи...',
  'Украшаем рецепт щепоткой магии...',
];

export const Loader: React.FC = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = loadingMessages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
      <div className="relative">
        <ChefHat className="w-16 h-16 text-green-500 animate-bounce" />
      </div>
      <p className="text-lg font-semibold text-gray-700 transition-opacity duration-500">
        {message}
      </p>
      <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full animate-loader-progress"></div>
      </div>
      <style>{`
                @keyframes loader-progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-loader-progress {
                    animation: loader-progress 2.5s linear infinite;
                }
            `}</style>
    </div>
  );
};
