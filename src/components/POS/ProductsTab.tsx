import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Package, Wind, Shield, Wrench, Gift, ScanLine } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: number;
  barcode?: string;
  image?: string;
}

interface ProductsTabProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addToOrder: (item: any, type: 'service' | 'product') => void;
}

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
        barcode: '123456789',
        image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop'
      },
      { 
        id: 2, 
        name: 'ملمع الإطارات', 
        price: 35, 
        category: 'cleaners', 
        inStock: 18, 
        barcode: '123456010',
        image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=250&fit=crop'
      },
      { 
        id: 3, 
        name: 'منظف الزجاج', 
        price: 25, 
        category: 'cleaners', 
        inStock: 30, 
        barcode: '123456791',
        image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=250&fit=crop'
      },
      { 
        id: 4, 
        name: 'منظف المحرك', 
        price: 55, 
        category: 'cleaners', 
        inStock: 12, 
        barcode: '123456792',
        image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=250&fit=crop'
      },
      { 
        id: 5, 
        name: 'مزيل الدهون', 
        price: 40, 
        category: 'cleaners', 
        inStock: 22, 
        barcode: '123456793',
        image: 'https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'fragrances',
    name: 'العطور والمعطرات',
    icon: Wind,
    products: [
      { 
        id: 6, 
        name: 'معطر فانيليا', 
        price: 20, 
        category: 'fragrances', 
        inStock: 15, 
        barcode: '123456794',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop'
      },
      { 
        id: 7, 
        name: 'معطر ليمون', 
        price: 20, 
        category: 'fragrances', 
        inStock: 22, 
        barcode: '123456795',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop'
      },
      { 
        id: 8, 
        name: 'معطر أوشين', 
        price: 25, 
        category: 'fragrances', 
        inStock: 12, 
        barcode: '123456796',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=250&fit=crop'
      },
      { 
        id: 9, 
        name: 'معطر اللافندر', 
        price: 30, 
        category: 'fragrances', 
        inStock: 8, 
        barcode: '123456797',
        image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop'
      },
      { 
        id: 10, 
        name: 'معطر الورد', 
        price: 28, 
        category: 'fragrances', 
        inStock: 18, 
        barcode: '123456798',
        image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'safety',
    name: 'مستلزمات السلامة',
    icon: Shield,
    products: [
      { 
        id: 11, 
        name: 'طفاية حريق محمولة', 
        price: 120, 
        category: 'safety', 
        inStock: 8, 
        barcode: '123456799',
        image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=250&fit=crop'
      },
      { 
        id: 12, 
        name: 'حقيبة إسعافات أولية', 
        price: 80, 
        category: 'safety', 
        inStock: 12, 
        barcode: '123456800',
        image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=250&fit=crop'
      },
      { 
        id: 13, 
        name: 'مثلث تحذير', 
        price: 25, 
        category: 'safety', 
        inStock: 15, 
        barcode: '123456801',
        image: 'https://images.unsplash.com/photo-1438565434616-3ef039228b15?w=400&h=250&fit=crop'
      },
      { 
        id: 14, 
        name: 'كاشف دخان', 
        price: 90, 
        category: 'safety', 
        inStock: 6, 
        barcode: '123456802',
        image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'tools',
    name: 'أدوات ومعدات',
    icon: Wrench,
    products: [
      { 
        id: 15, 
        name: 'مجموعة أدوات أساسية', 
        price: 150, 
        category: 'tools', 
        inStock: 10, 
        barcode: '123456803',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop'
      },
      { 
        id: 16, 
        name: 'مقياس ضغط الإطارات', 
        price: 35, 
        category: 'tools', 
        inStock: 20, 
        barcode: '123456804',
        image: 'https://images.unsplash.com/photo-1469474968028-56623f02e425?w=400&h=250&fit=crop'
      },
      { 
        id: 17, 
        name: 'كابل بطارية', 
        price: 65, 
        category: 'tools', 
        inStock: 12, 
        barcode: '123456805',
        image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop'
      },
      { 
        id: 18, 
        name: 'خرطوم الهواء', 
        price: 45, 
        category: 'tools', 
        inStock: 8, 
        barcode: '123456806',
        image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=250&fit=crop'
      }
    ]
  },
  {
    id: 'offers',
    name: 'عروض المنتجات',
    icon: Gift,
    products: [
      { 
        id: 19, 
        name: 'باقة التنظيف الكاملة (3+1)', 
        price: 120, 
        category: 'offers', 
        inStock: 5, 
        barcode: '123456807',
        image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop'
      },
      { 
        id: 20, 
        name: 'عرض المعطرات (2+1)', 
        price: 45, 
        category: 'offers', 
        inStock: 8, 
        barcode: '123456808',
        image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=250&fit=crop'
      },
      { 
        id: 21, 
        name: 'باقة الصيانة الأساسية', 
        price: 200, 
        category: 'offers', 
        inStock: 3, 
        barcode: '123456809',
        image: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=400&h=250&fit=crop'
      }
    ]
  }
];

const ProductsTab: React.FC<ProductsTabProps> = ({ searchTerm, setSearchTerm, addToOrder }) => {
  const [activeCategory, setActiveCategory] = useState('cleaners');
  const [barcodeInput, setBarcodeInput] = useState('');

  const handleBarcodeSearch = () => {
    if (!barcodeInput) return;
    
    // البحث عن المنتج بالباركود
    const allProducts = productCategories.flatMap(cat => cat.products);
    const product = allProducts.find(p => p.barcode === barcodeInput);
    
    if (product) {
      addToOrder(product, 'product');
      setBarcodeInput('');
    } else {
      // يمكن إضافة تنبيه هنا
      alert('لم يتم العثور على المنتج');
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-200 hover:border-green-300 bg-white"
      onClick={() => product.inStock > 0 && addToOrder(product, 'product')}
    >
      <div className="relative">
        {product.image && (
          <div className="h-40 w-full overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge 
            variant={product.inStock > 10 ? "default" : product.inStock > 0 ? "secondary" : "destructive"}
            className="bg-white/90 text-gray-700 text-xs font-medium"
          >
            {product.inStock > 0 ? `${product.inStock} متوفر` : 'نفذت الكمية'}
          </Badge>
        </div>
        {product.inStock === 0 && (
          <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center">
            <span className="text-white font-bold bg-red-600 px-3 py-1 rounded">نفذت الكمية</span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-lg text-gray-800 group-hover:text-green-600 transition-colors mb-1">
              {product.name}
            </h4>
            {product.barcode && (
              <div className="text-xs text-gray-500">
                الباركود: {product.barcode}
              </div>
            )}
          </div>
          
          <div className="flex justify-center items-center pt-2 border-t border-gray-100">
            <span className="font-bold text-green-600 text-xl">
              {product.price} رس
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div dir="rtl">
      {/* شريط البحث والباركود */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="البحث عن منتج..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <ScanLine className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="مسح الباركود أو إدخال يدوي"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="pr-10"
              onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch()}
            />
          </div>
          <Button onClick={handleBarcodeSearch} variant="outline">
            بحث
          </Button>
        </div>
      </div>

      {/* تبويبات تصنيفات المنتجات */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 bg-white border border-gray-200 p-1 rounded-xl shadow-sm">
          {productCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center gap-2 text-xs py-4 px-2 data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg transition-all duration-200 hover:bg-gray-50 data-[state=active]:shadow-md"
              >
                <Icon className="h-5 w-5" />
                <span className="text-center leading-tight font-medium">{category.name}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* محتوى كل تصنيف */}
        {productCategories.map((category) => {
          const filteredProducts = category.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.barcode && product.barcode.includes(searchTerm))
          );

          return (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-xl">
                  <div className="text-lg font-medium mb-2">لا توجد منتجات تطابق البحث</div>
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

export default ProductsTab;