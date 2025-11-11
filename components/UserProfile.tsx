import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from './Avatar';

export const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {user && (
        <div 
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Avatar 
            picture={user.picture}
            name={user.name}
            username={user.username}
          />
          
          {showTooltip && (
            <div className="absolute right-0 top-12 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-50 shadow-lg">
              <div className="font-medium">{user.name || user.username || 'Пользователь'}</div>
              {user.email && <div className="text-xs text-gray-300">{user.email}</div>}
              <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-800 transform rotate-45"></div>
            </div>
          )}
        </div>
      )}
      <button
        onClick={logout}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
      >
        Выйти
      </button>
    </div>
  );
};
