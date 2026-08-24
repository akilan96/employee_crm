import React, { useState, useEffect } from 'react';

const GRADIENTS = [
  'from-blue-600 to-indigo-700 shadow-blue-500/25 text-white',
  'from-emerald-500 to-teal-700 shadow-emerald-500/25 text-white',
  'from-purple-600 to-pink-600 shadow-purple-500/25 text-white',
  'from-amber-500 to-orange-600 shadow-amber-500/25 text-white',
  'from-cyan-500 to-blue-600 shadow-cyan-500/25 text-white',
  'from-rose-500 to-pink-700 shadow-rose-500/25 text-white',
  'from-violet-600 to-indigo-800 shadow-violet-500/25 text-white'
];

export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'NC';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NC';
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${first}${last}`;
};

export const getAvatarGradient = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENTS.length;
  return GRADIENTS[index];
};

export default function EmployeeAvatar({
  src,
  name,
  className = '',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'card'
  onClick,
  rounded = 'rounded-2xl'
}) {
  const [imageError, setImageError] = useState(false);

  // Reset error whenever src changes
  useEffect(() => {
    setImageError(false);
  }, [src]);

  const initials = getInitials(name);
  const gradientClass = getAvatarGradient(name);

  // If no photo or image load failed, render the stylish Initial Avatar
  if (!src || imageError) {
    let sizeClasses = 'w-12 h-12 text-sm';
    if (size === 'xs') sizeClasses = 'w-6 h-6 text-[10px]';
    else if (size === 'sm') sizeClasses = 'w-9 h-9 text-xs';
    else if (size === 'md') sizeClasses = 'w-12 h-12 text-sm';
    else if (size === 'lg') sizeClasses = 'w-14 h-14 text-base';
    else if (size === 'xl') sizeClasses = 'w-24 h-24 text-2xl';
    else if (size === '2xl') sizeClasses = 'w-32 h-32 text-3xl';
    else if (size === 'card') sizeClasses = 'w-full h-56 text-4xl';

    return (
      <div
        onClick={onClick}
        className={`bg-gradient-to-br ${gradientClass} ${sizeClasses} ${rounded} ${className} flex items-center justify-center font-black tracking-wider select-none shadow-md relative overflow-hidden`}
      >
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-xs pointer-events-none" />
        <span className="relative z-10 font-bold uppercase drop-shadow-sm">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={name || 'Employee Avatar'}
      onError={() => setImageError(true)}
      onClick={onClick}
      className={`${className} ${rounded} object-cover`}
    />
  );
}
