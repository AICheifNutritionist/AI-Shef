import React from 'react';

export const getInitials = (name?: string, username?: string): string => {
  const displayName = name || username || 'U';
  return displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarColor = (str?: string): string => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-yellow-500',
    'bg-red-500',
  ];

  const index = (str || '').charCodeAt(0) % colors.length;
  return colors[index];
};

interface AvatarProps {
  picture?: string;
  name?: string;
  username?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ picture, name, username, className = '' }) => {
  if (picture) {
    return (
      <img 
        src={picture} 
        alt={name || username || 'User'} 
        className={`w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-green-500 transition-all ${className}`}
      />
    );
  }

  return (
    <div className={`w-10 h-10 rounded-full ${getAvatarColor(username)} flex items-center justify-center text-white font-semibold text-sm cursor-pointer hover:ring-2 hover:ring-green-500 transition-all ${className}`}>
      {getInitials(name, username)}
    </div>
  );
};
