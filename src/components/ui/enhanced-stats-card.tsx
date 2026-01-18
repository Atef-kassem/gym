import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface EnhancedStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: ReactNode;
  icon: LucideIcon;
  color: string;
  index?: number;
  onClick?: () => void;
}

export function EnhancedStatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color, 
  index = 0,
  onClick 
}: EnhancedStatsCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      'blue': {
        bg: 'bg-blue-50 dark:bg-blue-950/20',
        gradient: 'from-blue-500 to-blue-600',
        iconBg: 'bg-blue-100 dark:bg-blue-950/20',
        text: 'text-blue-600',
        hover: 'hover:text-blue-700',
        border: 'border-blue-400',
        particle: 'bg-blue-400/60'
      },
      'green': {
        bg: 'bg-green-50 dark:bg-green-950/20',
        gradient: 'from-green-500 to-green-600',
        iconBg: 'bg-green-100 dark:bg-green-950/20',
        text: 'text-green-600',
        hover: 'hover:text-green-700',
        border: 'border-green-400',
        particle: 'bg-green-400/60'
      },
      'purple': {
        bg: 'bg-purple-50 dark:bg-purple-950/20',
        gradient: 'from-purple-500 to-purple-600',
        iconBg: 'bg-purple-100 dark:bg-purple-950/20',
        text: 'text-purple-600',
        hover: 'hover:text-purple-700',
        border: 'border-purple-400',
        particle: 'bg-purple-400/60'
      },
      'orange': {
        bg: 'bg-orange-50 dark:bg-orange-950/20',
        gradient: 'from-orange-500 to-orange-600',
        iconBg: 'bg-orange-100 dark:bg-orange-950/20',
        text: 'text-orange-600',
        hover: 'hover:text-orange-700',
        border: 'border-orange-400',
        particle: 'bg-orange-400/60'
      },
      'emerald': {
        bg: 'bg-emerald-50 dark:bg-emerald-950/20',
        gradient: 'from-emerald-500 to-emerald-600',
        iconBg: 'bg-emerald-100 dark:bg-emerald-950/20',
        text: 'text-emerald-600',
        hover: 'hover:text-emerald-700',
        border: 'border-emerald-400',
        particle: 'bg-emerald-400/60'
      },
      'yellow': {
        bg: 'bg-yellow-50 dark:bg-yellow-950/20',
        gradient: 'from-yellow-500 to-yellow-600',
        iconBg: 'bg-yellow-100 dark:bg-yellow-950/20',
        text: 'text-yellow-600',
        hover: 'hover:text-yellow-700',
        border: 'border-yellow-400',
        particle: 'bg-yellow-400/60'
      },
      'pink': {
        bg: 'bg-pink-50 dark:bg-pink-950/20',
        gradient: 'from-pink-500 to-pink-600',
        iconBg: 'bg-pink-100 dark:bg-pink-950/20',
        text: 'text-pink-600',
        hover: 'hover:text-pink-700',
        border: 'border-pink-400',
        particle: 'bg-pink-400/60'
      },
      'indigo': {
        bg: 'bg-indigo-50 dark:bg-indigo-950/20',
        gradient: 'from-indigo-500 to-indigo-600',
        iconBg: 'bg-indigo-100 dark:bg-indigo-950/20',
        text: 'text-indigo-600',
        hover: 'hover:text-indigo-700',
        border: 'border-indigo-400',
        particle: 'bg-indigo-400/60'
      }
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colorClasses = getColorClasses(color);

  return (
    <Card 
      className="group relative border-0 shadow-elegant hover:shadow-glow transition-all duration-500 hover:-translate-y-3 bg-card overflow-hidden cursor-pointer animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={onClick}
    >
      {/* Animated Background Effects */}
      <div className={`absolute inset-0 ${colorClasses.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      <div className={`absolute -inset-1 bg-gradient-to-br ${colorClasses.gradient} rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500`}></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className={`absolute top-4 right-4 w-2 h-2 ${colorClasses.particle} rounded-full animate-ping`}></div>
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-secondary/60 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-4 w-1.5 h-1.5 bg-accent/50 rounded-full animate-bounce"></div>
      </div>
      
      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2 z-10">
        <CardTitle className={`text-sm font-medium ${colorClasses.text} group-hover:text-primary transition-colors duration-300`}>
          {title}
        </CardTitle>
        <div className="relative">
          <div className={`p-3 rounded-xl ${colorClasses.iconBg} group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md group-hover:shadow-glow`}>
            <Icon className={`h-6 w-6 ${colorClasses.text} group-hover:animate-pulse transition-colors duration-300`} />
          </div>
          {/* Rotating Ring */}
          <div className={`absolute inset-0 rounded-xl border-2 ${colorClasses.border} opacity-0 group-hover:opacity-100 group-hover:animate-spin transition-opacity duration-500`}></div>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground group-hover:scale-110 group-hover:text-primary transition-all duration-300">
          {value}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors duration-300 mt-1">
            {subtitle}
          </div>
        )}
      </CardContent>
      
      {/* Progress Bar Animation */}
      <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${colorClasses.gradient} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
    </Card>
  );
}