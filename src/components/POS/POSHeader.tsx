import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Package, Wrench, User, MapPin } from 'lucide-react';

interface POSHeaderProps {
  activeTab: 'services' | 'products' | 'oil';
  setActiveTab: (tab: 'services' | 'products' | 'oil') => void;
  currentUser?: any;
  servicePath?: string;
}

const POSHeader: React.FC<POSHeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser,
  servicePath 
}) => {
  return (
    <div className="bg-gradient-to-l from-blue-600 to-blue-400 rounded-lg p-6 mb-6 text-white" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl shadow-lg">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">نظام نقاط البيع المتطور</h1>
            <p className="text-blue-100">خدمات ومنتجات مغاسل وخدمات  الكافية</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {currentUser && (
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{currentUser.name}</span>
              </div>
            </div>
          )}
          {servicePath && (
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{servicePath}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'services' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 ${
            activeTab === 'services' 
              ? 'bg-white text-blue-600 hover:bg-white/90' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Car className="h-4 w-4" />
          خدمات
        </Button>
        
        <Button
          variant={activeTab === 'products' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 ${
            activeTab === 'products' 
              ? 'bg-white text-blue-600 hover:bg-white/90' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Package className="h-4 w-4" />
          منتجات
        </Button>
        
        <Button
          variant={activeTab === 'oil' ? 'secondary' : 'ghost'}
          onClick={() => setActiveTab('oil')}
          className={`flex items-center gap-2 ${
            activeTab === 'oil' 
              ? 'bg-white text-blue-600 hover:bg-white/90' 
              : 'text-white hover:bg-white/10'
          }`}
        >
          <Wrench className="h-4 w-4" />
          خدمات الزيت
        </Button>
      </div>
    </div>
  );
};

export default POSHeader;