import React from 'react';
import { User, Building2, Users, Car, Phone, Mail, MapPin } from 'lucide-react';

interface ImagePlaceholderProps {
  type: 'customer' | 'car' | 'contact' | 'location' | 'company' | 'group';
  size?: number;
  className?: string;
  text?: string;
}

const placeholderConfig = {
  customer: {
    icon: User,
    bgColor: 'bg-gradient-to-br from-blue-100 to-blue-200',
    borderColor: 'border-blue-300',
    iconColor: 'text-blue-600'
  },
  car: {
    icon: Car,
    bgColor: 'bg-gradient-to-br from-green-100 to-green-200',
    borderColor: 'border-green-300',
    iconColor: 'text-green-600'
  },
  contact: {
    icon: Phone,
    bgColor: 'bg-gradient-to-br from-purple-100 to-purple-200',
    borderColor: 'border-purple-300',
    iconColor: 'text-purple-600'
  },
  location: {
    icon: MapPin,
    bgColor: 'bg-gradient-to-br from-red-100 to-red-200',
    borderColor: 'border-red-300',
    iconColor: 'text-red-600'
  },
  company: {
    icon: Building2,
    bgColor: 'bg-gradient-to-br from-indigo-100 to-indigo-200',
    borderColor: 'border-indigo-300',
    iconColor: 'text-indigo-600'
  },
  group: {
    icon: Users,
    bgColor: 'bg-gradient-to-br from-pink-100 to-pink-200',
    borderColor: 'border-pink-300',
    iconColor: 'text-pink-600'
  }
};

export function ImagePlaceholder({ 
  type, 
  size = 100, 
  className = '',
  text
}: ImagePlaceholderProps) {
  const config = placeholderConfig[type];
  const Icon = config.icon;
  
  const iconSize = size <= 32 ? 12 : size <= 48 ? 16 : size <= 64 ? 20 : size <= 96 ? 24 : 32;

  return (
    <div 
      className={`${config.bgColor} ${config.borderColor} border-2 rounded-full flex flex-col items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Icon className={`${config.iconColor}`} size={iconSize} />
      {text && size > 48 && (
        <span className={`text-xs ${config.iconColor} font-medium mt-1 text-center px-1`}>
          {text}
        </span>
      )}
    </div>
  );
}

// مكون SVG placeholder
export function SVGPlaceholder({ 
  type, 
  size = 100, 
  className = '',
  text
}: ImagePlaceholderProps) {
  const config = placeholderConfig[type];
  const Icon = config.icon;
  
  const iconSize = size <= 32 ? 12 : size <= 48 ? 16 : size <= 64 ? 20 : size <= 96 ? 24 : 32;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      className={className}
    >
      <defs>
        <linearGradient id={`gradient-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: config.bgColor.replace('bg-gradient-to-br from-', '').split(' ')[0] }} />
          <stop offset="100%" style={{ stopColor: config.bgColor.replace('bg-gradient-to-br from-', '').split(' ')[1] }} />
        </linearGradient>
      </defs>
      
      <circle 
        cx={size / 2} 
        cy={size / 2} 
        r={size / 2 - 2} 
        fill={`url(#gradient-${type})`}
        stroke={config.borderColor.replace('border-', '')}
        strokeWidth="2"
      />
      
      <foreignObject x="0" y="0" width={size} height={size}>
        <div className="flex flex-col items-center justify-center h-full">
          <Icon className={config.iconColor} size={iconSize} />
          {text && size > 48 && (
            <span className={`text-xs ${config.iconColor} font-medium mt-1 text-center px-1`}>
              {text}
            </span>
          )}
        </div>
      </foreignObject>
    </svg>
  );
}
