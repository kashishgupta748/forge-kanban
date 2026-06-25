import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, color, className = '' }) => {
  // If a hex color is provided, we use it for background with opacity and solid text.
  // Otherwise default to slate.
  const style = color ? {
    backgroundColor: `${color}20`,
    color: color,
    borderColor: `${color}40`,
  } : {};

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${!color ? 'bg-slate-800 text-slate-300 border-slate-700' : ''} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default Badge;
