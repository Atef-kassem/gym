import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Sparkles, Star, Loader2 } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animation?: 'glow' | 'float' | 'bounce' | 'shimmer' | 'heartbeat';
  loading?: boolean;
  className?: string;
}

export function AnimatedButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  animation = 'glow',
  loading = false,
  className = "" 
}: AnimatedButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white';
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'lg':
        return 'px-6 py-4 text-lg';
      default:
        return 'px-4 py-3 text-base';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'glow':
        return 'animate-glow-pulse';
      case 'float':
        return 'animate-float';
      case 'bounce':
        return 'hover:animate-bounce-in';
      case 'shimmer':
        return 'animate-shimmer';
      case 'heartbeat':
        return 'animate-heartbeat';
      default:
        return 'animate-glow-pulse';
    }
  };

  return (
    <Button
      onClick={onClick}
      disabled={loading}
      className={`
        relative overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-xl 
        transition-all duration-300 hover:scale-105 transform-gpu
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${!loading ? getAnimationClasses() : ''}
        ${className}
      `}
    >
      {/* خلفية متحركة */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 animate-gradient-x" />
      
      {/* محتوى الزر */}
      <div className="relative flex items-center gap-2">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4 animate-pulse" />
        )}
        <span className="font-bold">{children}</span>
        {!loading && (
          <div className="flex items-center">
            <Star className="h-3 w-3 animate-pulse" />
          </div>
        )}
      </div>

      {/* تأثير الريبل */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-white/10 animate-ripple rounded-xl" />
      </div>
    </Button>
  );
}

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  tilt?: boolean;
}

export function InteractiveCard({ 
  children, 
  className = "", 
  hover = true, 
  glow = false,
  tilt = false 
}: InteractiveCardProps) {
  return (
    <Card 
      className={`
        relative overflow-hidden transition-all duration-300 transform-gpu
        ${hover ? 'hover:scale-105 hover:shadow-xl' : ''}
        ${glow ? 'animate-glow-pulse' : ''}
        ${tilt ? 'hover:rotate-1' : ''}
        ${className}
      `}
    >
      {/* خلفية ديكوراتيف */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-16 translate-x-16 animate-float" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full translate-y-12 -translate-x-12 animate-float" style={{ animationDelay: '1s' }} />
      
      {/* محتوى البطاقة */}
      <div className="relative z-10">
        {children}
      </div>

      {/* تأثير الهوفر */}
      {hover && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 animate-shimmer" />
        </div>
      )}
    </Card>
  );
}

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'processing';
  children: React.ReactNode;
  pulse?: boolean;
  glow?: boolean;
}

export function StatusBadge({ status, children, pulse = false, glow = false }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white';
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'info':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
      case 'processing':
        return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  return (
    <Badge 
      className={`
        relative overflow-hidden border-0 shadow-md
        ${getStatusClasses()}
        ${pulse ? 'animate-pulse' : ''}
        ${glow ? 'animate-glow-pulse' : ''}
        transition-all duration-300 hover:scale-110
      `}
    >
      <div className="relative flex items-center gap-1">
        <div className={`w-2 h-2 rounded-full bg-white animate-pulse`} />
        {children}
      </div>
      
      {/* تأثير الشيمر */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
    </Badge>
  );
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 5, className = "" }: FloatingParticlesProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full animate-bubble-float"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
}

export default {
  AnimatedButton,
  InteractiveCard,
  StatusBadge,
  FloatingParticles
};