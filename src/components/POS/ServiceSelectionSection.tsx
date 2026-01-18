import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Car, Sparkles, Wrench, Wind, Package, Star, Filter, Grid3X3 } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  image?: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: number;
  image?: string;
}

import { OrderItem } from "@/types/pos";

interface ServiceSelectionSectionProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addToOrder: (item: any, type: 'service' | 'product') => void;
}

// Mock data for services with accurate images
const serviceCategories = [
  {
    id: 'washing',
    name: '   الكافية',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop',
    services: [
      { 
        id: 1, 
        name: '  سريع', 
        price: 25, 
        duration: 15, 
        description: '  خارجي سريع وفعال',
        image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300&h=200&fit=crop'
      },
      { 
        id: 2, 
        name: '  شامل', 
        price: 45, 
        duration: 30, 
        description: '  داخلي وخارجي كامل',
        image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=300&h=200&fit=crop'
      },
      { 
        id: 3, 
        name: '  VIP', 
        price: 85, 
        duration: 60, 
        description: '  شامل مع خدمات إضافية مميزة',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop'
      }
    ]
  },
  {
    id: 'polishing',
    name: 'التلميع والتشميع',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400&h=300&fit=crop',
    services: [
      { 
        id: 4, 
        name: 'تلميع خارجي', 
        price: 120, 
        duration: 45, 
        description: 'تلميع احترافي للجسم الخارجي',
        image: 'https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=300&h=200&fit=crop'
      },
      { 
        id: 5, 
        name: 'تشميع كامل', 
        price: 200, 
        duration: 90, 
        description: 'تشميع وحماية شاملة طويلة المدى',
        image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=300&h=200&fit=crop'
      }
    ]
  },
  {
    id: 'mechanical',
    name: 'خدمات ميكانيكية',
    icon: Wrench,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    services: [
      { 
        id: 6, 
        name: 'تغيير زيت', 
        price: 80, 
        duration: 30, 
        description: 'تغيير زيت المحرك والفلتر',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop'
      },
      { 
        id: 7, 
        name: 'فحص شامل', 
        price: 150, 
        duration: 60, 
        description: 'فحص شامل للمشروب وأنظمتها',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop'
      }
    ]
  },
  {
    id: 'additional',
    name: 'التعطير والتجهيز',
    icon: Wind,
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=300&fit=crop',
    services: [
      { 
        id: 8, 
        name: 'تعطير داخلي', 
        price: 35, 
        duration: 15, 
        description: 'تعطير المقاعد والداخلية برائحة منعشة',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop'
      },
      { 
        id: 9, 
        name: 'تنظيف المحرك', 
        price: 100, 
        duration: 45, 
        description: 'تنظيف وتلميع حجرة المحرك',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop'
      }
    ]
  },
  {
    id: 'packages',
    name: 'باقات خاصة',
    icon: Star,
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop',
    services: [
      { 
        id: 10, 
        name: 'باقة الملك', 
        price: 300, 
        duration: 120, 
        description: 'باقة شاملة مع جميع الخدمات المميزة',
        image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=300&h=200&fit=crop'
      },
      { 
        id: 11, 
        name: 'باقة العائلة', 
        price: 180, 
        duration: 75, 
        description: 'باقة مناسبة للمشروبات العائلية',
        image: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=300&h=200&fit=crop'
      }
    ]
  }
];

// Mock data for products with accurate images
const productCategories = [
  {
    id: 'cleaners',
    name: 'المنظفات ومواد ال ',
    icon: Package,
    products: [
      { 
        id: 1, 
        name: 'شامبو  الكافية المركز', 
        price: 45, 
        category: 'cleaners', 
        inStock: 25,
        image: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302?w=300&h=200&fit=crop'
      },
      { 
        id: 2, 
        name: 'ملمع الإطارات', 
        price: 35, 
        category: 'cleaners', 
        inStock: 18,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=200&fit=crop'
      },
      { 
        id: 3, 
        name: 'منظف الزجاج', 
        price: 25, 
        category: 'cleaners', 
        inStock: 30,
        image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=300&h=200&fit=crop'
      }
    ]
  },
  {
    id: 'fragrances',
    name: 'العطور والمعطرات',
    icon: Wind,
    products: [
      { 
        id: 4, 
        name: 'معطر فانيليا', 
        price: 20, 
        category: 'fragrances', 
        inStock: 15,
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=300&h=200&fit=crop'
      },
      { 
        id: 5, 
        name: 'معطر ليمون', 
        price: 20, 
        category: 'fragrances', 
        inStock: 22,
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop'
      },
      { 
        id: 6, 
        name: 'معطر أوشين', 
        price: 25, 
        category: 'fragrances', 
        inStock: 12,
        image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=300&h=200&fit=crop'
      }
    ]
  }
];

export function ServiceSelectionSection({
  searchTerm,
  setSearchTerm,
  addToOrder
}: ServiceSelectionSectionProps) {
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [activeServiceCategory, setActiveServiceCategory] = useState<string>('washing');
  const [activeProductCategory, setActiveProductCategory] = useState<string>('cleaners');
  const [showNextServiceCategory, setShowNextServiceCategory] = useState(false);
  const [showNextProductCategory, setShowNextProductCategory] = useState(false);
  const handleServiceSelect = (service: Service) => {
    addToOrder(service, 'service');
    
    // العثور على التصنيف الحالي والتالي
    const currentIndex = serviceCategories.findIndex(cat => cat.id === activeServiceCategory);
    if (currentIndex < serviceCategories.length - 1) {
      const nextCategory = serviceCategories[currentIndex + 1];
      setActiveServiceCategory(nextCategory.id);
      setShowNextServiceCategory(true);
    }
  };

  const handleProductSelect = (product: Product) => {
    if (product.inStock > 0) {
      addToOrder(product, 'product');
      
      // العثور على التصنيف الحالي والتالي
      const currentIndex = productCategories.findIndex(cat => cat.id === activeProductCategory);
      if (currentIndex < productCategories.length - 1) {
        const nextCategory = productCategories[currentIndex + 1];
        setActiveProductCategory(nextCategory.id);
        setShowNextProductCategory(true);
      }
    }
  };

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card 
      className="cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group border-2 hover:border-primary/50 bg-gradient-card overflow-hidden relative hover-lift"
      onClick={() => handleServiceSelect(service)}
    >
      {/* صورة الخدمة */}
      {service.image && (
        <div className="relative h-24 sm:h-32 overflow-hidden">
          <img 
            src={service.image} 
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs bg-white/90 text-gray-800 animate-pulse group-hover:bg-primary group-hover:text-white transition-all duration-300">
              {service.duration} دقيقة
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className="p-3 sm:p-4 relative">
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-bold text-sm sm:text-lg group-hover:text-primary transition-colors duration-300">{service.name}</h4>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
            <span className="font-bold text-primary text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200 flex items-center">
              {service.price} 
              <span className="text-sm mr-1">جنيه مصري</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="cursor-pointer hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in group border-2 hover:border-primary/50 bg-gradient-card overflow-hidden relative hover-lift"
      onClick={() => handleProductSelect(product)}
    >
      {/* صورة المنتج */}
      {product.image && (
        <div className="relative h-24 sm:h-32 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent group-hover:from-black/40 transition-all duration-300"></div>
          <div className="absolute top-2 right-2">
            <Badge 
              variant={product.inStock > 10 ? "default" : product.inStock > 0 ? "secondary" : "destructive"}
              className="text-xs bg-white/90 text-gray-800 animate-pulse group-hover:scale-110 transition-all duration-300"
            >
              {product.inStock > 0 ? `${product.inStock} متوفر` : 'نفذت الكمية'}
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className="p-3 sm:p-4 relative">
        <div className="space-y-2 sm:space-y-3">
          <h4 className="font-bold text-sm sm:text-lg group-hover:text-primary transition-colors duration-300">{product.name}</h4>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
            <span className="font-bold text-primary text-lg sm:text-xl group-hover:scale-110 transition-transform duration-200 flex items-center">
              {product.price} 
              <span className="text-sm mr-1">جنيه مصري</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="animate-fade-in hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30 bg-gradient-card shadow-elegant">
      <CardHeader className="pb-4 bg-gradient-raghwa text-white rounded-t-lg relative overflow-hidden">
        {/* خلفية ديكوراتيف */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-8 w-16 h-16 rounded-full bg-white/20"></div>
          <div className="absolute bottom-1 left-4 w-12 h-12 rounded-full bg-white/15"></div>
        </div>
        
        <div className="relative z-10">
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl shadow-lg">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">اختيار الخدمات والمنتجات</h2>
                <p className="text-white/80 text-sm font-normal mt-1">خدمات متطورة ومنتجات عالية الجودة</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView(activeView === 'grid' ? 'list' : 'grid')}
                className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:shadow-lg animate-pulse"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-3 py-1 animate-fade-in hover:bg-white/30 transition-all duration-300">
                عرض {activeView === 'grid' ? 'شبكي' : 'قائمة'}
              </Badge>
            </div>
          </CardTitle>
          
          <div className="relative mt-4">
            <Search className="absolute right-3 top-3 h-4 w-4 text-white/70" />
            <Input
              placeholder="البحث عن خدمة أو منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:bg-white/20 transition-all duration-200"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-gradient-to-r from-gray-100 to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
            <TabsTrigger 
              value="services" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-raghwa data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg font-semibold animate-fade-in"
            >
              <Car className="h-5 w-5 animate-pulse" />
              <span>الخدمات</span>
            </TabsTrigger>
            <TabsTrigger 
              value="products" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-raghwa data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg font-semibold animate-fade-in"
            >
              <Package className="h-5 w-5 animate-pulse" />
              المنتجات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-8 animate-fade-in">
            <Tabs value={activeServiceCategory} onValueChange={setActiveServiceCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 p-2 bg-gradient-to-r from-gray-100 to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                {serviceCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id} 
                      value={category.id} 
                      className="flex flex-col items-center gap-1 text-xs py-3 px-2 data-[state=active]:bg-gradient-raghwa data-[state=active]:text-white data-[state=active]:shadow-xl transition-all duration-500 hover:scale-105 rounded-xl font-medium hover:bg-white/50 animate-scale-in"
                    >
                      <Icon className="h-4 w-4 animate-bounce group-hover:animate-pulse" />
                      <span className="text-center leading-tight">{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {serviceCategories.map((category) => {
                const filteredServices = category.services.filter(service =>
                  service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  service.description.toLowerCase().includes(searchTerm.toLowerCase())
                );

                return (
                  <TabsContent key={category.id} value={category.id} className="space-y-4">
                    <div className={`grid gap-3 sm:gap-4 ${
                      activeView === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {filteredServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                    {filteredServices.length === 0 && searchTerm && (
                      <div className="text-center text-muted-foreground py-8">
                        <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm sm:text-base">لا توجد خدمات تطابق البحث "{searchTerm}"</p>
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <Package className="h-5 w-5" />
                المنتجات المتاحة
              </h3>
              <Badge variant="outline" className="text-primary border-primary">
                {productCategories.reduce((total, cat) => total + cat.products.length, 0)} منتج
              </Badge>
            </div>
            
            <Tabs value={activeProductCategory} onValueChange={setActiveProductCategory} className="w-full">
              <TabsList className="grid w-full grid-cols-2 p-2 bg-gradient-to-r from-gray-100 to-green-50 rounded-xl shadow-md mb-6">
                {productCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <TabsTrigger 
                      key={category.id}
                      value={category.id}
                      className="flex items-center gap-2 text-sm py-3 px-4 data-[state=active]:bg-gradient-raghwa data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105 rounded-lg font-medium"
                    >
                      <Icon className="h-4 w-4 animate-bounce" />
                      <span>{category.name}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {productCategories.map((category) => {
                const filteredProducts = category.products.filter(product =>
                  product.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredProducts.length === 0 && searchTerm) return null;

                return (
                  <TabsContent key={category.id} value={category.id} className="space-y-4">
                    <div className={`grid gap-3 sm:gap-4 ${
                      activeView === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                    {filteredProducts.length === 0 && searchTerm && (
                      <div className="text-center text-muted-foreground py-8">
                        <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm sm:text-base">لا توجد منتجات تطابق البحث "{searchTerm}"</p>
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}