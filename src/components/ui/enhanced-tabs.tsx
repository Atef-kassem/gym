import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LucideIcon } from 'lucide-react';

interface EnhancedTabItem {
  value: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface EnhancedTabsProps {
  items: EnhancedTabItem[];
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function EnhancedTabs({ 
  items, 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className = "" 
}: EnhancedTabsProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      'blue': 'data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 from-blue-500/10 to-cyan-500/10 bg-blue-400/60',
      'green': 'data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 from-green-500/10 to-emerald-500/10 bg-green-400/60',
      'purple': 'data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 from-purple-500/10 to-indigo-500/10 bg-purple-400/60',
      'orange': 'data-[state=active]:from-orange-500 data-[state=active]:to-red-500 from-orange-500/10 to-red-500/10 bg-orange-400/60',
      'pink': 'data-[state=active]:from-pink-500 data-[state=active]:to-rose-500 from-pink-500/10 to-rose-500/10 bg-pink-400/60',
      'indigo': 'data-[state=active]:from-indigo-500 data-[state=active]:to-purple-500 from-indigo-500/10 to-purple-500/10 bg-indigo-400/60',
      'emerald': 'data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 from-emerald-500/10 to-teal-500/10 bg-emerald-400/60',
      'yellow': 'data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 from-yellow-500/10 to-amber-500/10 bg-yellow-400/60',
      'teal': 'data-[state=active]:from-teal-500 data-[state=active]:to-cyan-500 from-teal-500/10 to-cyan-500/10 bg-teal-400/60',
      'slate': 'data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 from-slate-500/10 to-gray-600/10 bg-slate-400/60'
    };
    
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const gridCols = items.length <= 4 ? `grid-cols-${items.length}` : 
                  items.length <= 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' :
                  items.length <= 8 ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' :
                  'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9';

  return (
    <Tabs 
      defaultValue={defaultValue} 
      value={value} 
      onValueChange={onValueChange} 
      className={`space-y-6 ${className}`}
    >
      <TabsList className={`grid w-full ${gridCols} bg-gradient-to-r from-background/80 via-muted/60 to-background/80 backdrop-blur-md shadow-elegant border border-border/40 rounded-2xl p-2 gap-1 overflow-hidden`}>
        {items.map((item) => {
          const colorClasses = getColorClasses(item.color);
          const [activeGradient, hoverGradient, particleColor] = colorClasses.split(' ');
          
          return (
            <TabsTrigger
              key={item.value}
              value={item.value}
              className={`group relative flex items-center gap-2 text-xs px-3 py-2 rounded-xl data-[state=active]:bg-gradient-to-r ${activeGradient} data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-500 hover:scale-105 data-[state=active]:scale-105 overflow-hidden`}
            >
              {/* Background Effects */}
              <div className={`absolute inset-0 bg-gradient-to-r ${hoverGradient} opacity-0 group-hover:opacity-100 group-data-[state=active]:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-data-[state=active]:translate-x-full transition-transform duration-1000"></div>
              
              {/* Floating Particle */}
              <div className={`absolute top-1 right-1 w-1 h-1 ${particleColor} rounded-full opacity-0 group-data-[state=active]:opacity-100 group-data-[state=active]:animate-ping`}></div>
              
              {/* Icon */}
              <item.icon className="h-4 w-4 relative z-10 group-data-[state=active]:animate-pulse" />
              
              {/* Label */}
              <span className="relative z-10 font-medium">{item.label}</span>
              
              {/* Bottom Border Animation */}
              <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r ${activeGradient.replace('data-[state=active]:', '')} scale-x-0 group-data-[state=active]:scale-x-100 transition-transform duration-500 origin-center`}></div>
            </TabsTrigger>
          );
        })}
      </TabsList>
      
      {children}
    </Tabs>
  );
}

export { TabsContent };