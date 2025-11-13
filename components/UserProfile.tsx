import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from './Avatar';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
      {user && (
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Avatar picture={user.picture} name={user.name} username={user.username} />

          {showTooltip && (
            <div className="absolute right-0 top-11 sm:top-12 md:top-14 bg-gray-800 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs md:text-sm whitespace-nowrap z-50 shadow-lg">
              <div className="font-medium leading-tight">
                {user.name || user.username || 'Пользователь'}
              </div>

              {user.email && (
                <div className="text-[9px] sm:text-xs text-gray-300 leading-tight">
                  {user.email}
                </div>
              )}

              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45" />
            </div>
          )}
        </div>
      )}

      <button
        onClick={logout}
        className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-[11px] sm:text-xs md:text-sm font-medium min-h-[36px] sm:min-h-[40px]"
      >
        Выйти
      </button>
    </div>
  );
};
