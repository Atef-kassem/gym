import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Car, Sparkles, Wrench, Wind, Star } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  image?: string;
}

interface ServicesTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addToOrder: (item: any, type: 'service' | 'product') => void;
}

const serviceCategories = [
  {
    id: 'washing',
    name: '   الكافية',
    icon: Car,
    services: [
      { 
        id: 1, 
        name: '  سريع', 
        price: 25, 
        duration: 15, 
        description: '  خارجي سريع وفعال',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
      },
      { 
        id: 2, 
        name: '  شامل', 
        price: 45, 
        duration: 30, 
        description: '  داخلي وخارجي كامل',
        image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=400&h=250&fit=crop'
      },
      { 
        id: 3, 
        name: '  VIP', 
        price: 85, 
        duration: 60, 
        description: '  شامل مع خدمات إضافية مميزة',
        image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'polishing',
    name: 'التلميع والتشميع',
    icon: Sparkles,
    services: [
      { 
        id: 4, 
        name: 'تلميع خارجي', 
        price: 120, 
        duration: 45, 
        description: 'تلميع احترافي للجسم الخارجي',
        image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=250&fit=crop'
      },
      { 
        id: 5, 
        name: 'تشميع كامل', 
        price: 200, 
        duration: 90, 
        description: 'تشميع وحماية شاملة طويلة المدى',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop'
      },
      { 
        id: 6, 
        name: 'حماية سيراميك', 
        price: 350, 
        duration: 120, 
        description: 'حماية سيراميك متقدمة',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'mechanical',
    name: 'خدمات ميكانيكية خفيفة',
    icon: Wrench,
    services: [
      { 
        id: 7, 
        name: 'تغيير فلتر هواء', 
        price: 40, 
        duration: 15, 
        description: 'تغيير فلتر الهواء',
        image: 'https://images.unsplash.com/photo-1572242863741-834c8b2f0c6d?w=400&h=250&fit=crop'
      },
      { 
        id: 8, 
        name: 'فحص ضغط الإطارات', 
        price: 20, 
        duration: 10, 
        description: 'فحص وضبط ضغط الإطارات',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
      },
      { 
        id: 9, 
        name: 'تنظيف حجرة المحرك', 
        price: 80, 
        duration: 30, 
        description: 'تنظيف وتلميع حجرة المحرك',
        image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'additional',
    name: 'التعطير والتجهيز',
    icon: Wind,
    services: [
      { 
        id: 10, 
        name: 'تعطير داخلي', 
        price: 35, 
        duration: 15, 
        description: 'تعطير المقاعد والداخلية',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=250&fit=crop'
      },
      { 
        id: 11, 
        name: 'تنظيف المكيف', 
        price: 60, 
        duration: 25, 
        description: 'تنظيف وتعقيم نظام التكييف',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop'
      },
      { 
        id: 12, 
        name: 'تلميع الجلد', 
        price: 90, 
        duration: 40, 
        description: 'تنظيف وتلميع المقاعد الجلدية',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'packages',
    name: 'باقات خاصة',
    icon: Star,
    services: [
      { 
        id: 13, 
        name: 'باقة الملك', 
        price: 300, 
        duration: 120, 
        description: 'باقة شاملة مع جميع الخدمات المميزة',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop'
      },
      { 
        id: 14, 
        name: 'باقة العائلة', 
        price: 180, 
        duration: 75, 
        description: 'باقة مناسبة للمشروبات العائلية',
        image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop'
      },
      { 
        id: 15, 
        name: 'باقة السرعة', 
        price: 65, 
        duration: 30, 
        description: 'باقة سريعة للخدمات الأساسية',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop'
      }
    ]
  }
];

const ServicesTab: React.FC<ServicesTabProps> = ({ searchTerm, setSearchTerm, addToOrder }) => {
  const [activeCategory, setActiveCategory] = useState('washing');

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-200 hover:border-blue-300 bg-white"
      onClick={() => addToOrder(service, 'service')}
    >
      <div className="relative">
        {service.image && (
          <div className="h-40 w-full overflow-hidden">
            <img 
              src={service.image} 
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs font-medium">
            {service.duration} دقيقة
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
              {service.name}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
          </div>
          
          <div className="flex justify-center items-center pt-2 border-t border-gray-100">
            <span className="font-bold text-blue-600 text-xl">
              {service.price} رس
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div dir="rtl">
      {/* شريط البحث */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث عن خدمة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
      </div>

      {/* تبويبات تصنيفات الخدمات */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
          {serviceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-2 text-xs py-4 px-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:shadow-md"
              >
                <Icon className="h-5 w-5" />
                <span className="text-center leading-tight font-medium">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* محتوى كل تصنيف */}
        {serviceCategories.map((category) => {
          const filteredServices = category.services.filter(service =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              
              {filteredServices.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                  <div className="text-lg font-medium mb-2">لا توجد خدمات تطابق البحث</div>
                  <div className="text-sm">"{searchTerm}"</div>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ServicesTab;