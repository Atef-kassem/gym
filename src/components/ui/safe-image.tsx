import React, { useState, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building2, Users } from 'lucide-react';

interface SafeImageProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'custom';
  className?: string;
  customerType?: 'Individual' | 'Company' | 'Group';
  showFallback?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  custom: ''
};

const fallbackIcons = {
  Individual: User,
  Company: Building2,
  Group: Users,
  default: User
};

export function SafeImage({ 
  src, 
  alt, 
  fallback = '/api/placeholder/100/100',
  size = 'md',
  className = '',
  customerType = 'Individual',
  showFallback = false
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setImageError(false);
  }, []);

  const handleImageError = useCallback(() => {
    setIsLoading(false);
    setImageError(true);
  }, []);

  const shouldShowFallback = showFallback || imageError || !src || src === '';
  const Icon = fallbackIcons[customerType] || fallbackIcons.default;

  // إذا كان يجب إظهار fallback أو حدث خطأ
  if (shouldShowFallback) {
    return (
      <div className={`${sizeClasses[size]} ${className} rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-300 flex items-center justify-center`}>
        <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-10 h-10'} text-blue-600`} />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} ${className} rounded-full object-cover border-2 border-gray-200 transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
    </div>
  );
}

// مكون Avatar آمن
export function SafeAvatar({ 
  src, 
  alt, 
  fallback,
  size = 'md',
  className = '',
  customerType = 'Individual'
}: SafeImageProps) {
  const [imageError, setImageError] = useState(false);
  const Icon = fallbackIcons[customerType] || fallbackIcons.default;

  if (imageError || !src || src === '') {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 border-2 border-blue-300">
          <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-10 h-10'}`} />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={src} alt={alt} onError={() => setImageError(true)} />
      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 border-2 border-blue-300">
        <Icon className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-10 h-10'}`} />
      </AvatarFallback>
    </Avatar>
  );
}
