import React from 'react';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colors = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 
  'bg-pink-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const getColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const Avatar: React.FC<AvatarProps> = ({ name, src, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  const baseClasses = `rounded-full flex items-center justify-center font-bold text-white shrink-0 ${sizes[size]} ${className}`;

  if (src) {
    return (
      <img 
        src={src} 
        alt={name} 
        className={`${baseClasses} object-cover border-2 border-slate-900`} 
      />
    );
  }

  const bgColor = getColor(name);

  return (
    <div className={`${baseClasses} ${bgColor} border-2 border-slate-900 shadow-sm`} title={name}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
