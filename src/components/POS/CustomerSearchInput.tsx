import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Plus, X } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastVisit?: string;
}

interface CustomerSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onCustomerSelect?: (customer: Customer) => void;
  showAddButton?: boolean;
  onAddNew?: () => void;
}

export function CustomerSearchInput({
  value,
  onChange,
  placeholder = "البحث عن عميل بالاسم أو الهاتف",
  onCustomerSelect,
  showAddButton = true,
  onAddNew
}: CustomerSearchInputProps) {
  console.log('🎯 CustomerSearchInput تم تحميله، القيمة:', value);
  
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // عملاء وهميين للتجربة
  const mockCustomers: Customer[] = [
    { id: '1', name: 'أحمد محمد علي', phone: '0501234567', email: 'ahmed@example.com', lastVisit: '2024-01-15' },
    { id: '2', name: 'فاطمة سالم', phone: '0507654321', email: 'fatima@example.com', lastVisit: '2024-01-10' },
    { id: '3', name: 'محمد عبدالله', phone: '0509876543', email: 'mohammed@example.com', lastVisit: '2024-01-08' },
    { id: '4', name: 'نورا أحمد', phone: '0502468135', email: 'nora@example.com', lastVisit: '2024-01-05' },
    { id: '5', name: 'خالد سعد', phone: '0508642097', email: 'khalid@example.com', lastVisit: '2024-01-03' },
    { id: '6', name: 'سارة محمد', phone: '0503691472', email: 'sara@example.com', lastVisit: '2024-01-01' }
  ];

  const searchCustomers = (query: string) => {
    console.log('🔍 البحث عن:', query);
    
    if (!query || query.length < 2) {
      console.log('❌ استعلام قصير جداً:', query);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    console.log('🔄 بدء البحث...');
    
    // محاكاة البحث مع تأخير
    setTimeout(() => {
      const filtered = mockCustomers.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query)
      );
      console.log('✅ نتائج البحث:', filtered);
      setSearchResults(filtered);
      setIsLoading(false);
    }, 300);
  };

  const handleInputChange = (newValue: string) => {
    console.log('📝 تغيير القيمة:', newValue);
    onChange(newValue);
    searchCustomers(newValue);
    setIsOpen(true);
    console.log('📂 القائمة مفتوحة:', true);
  };

  // إضافة useEffect لمراقبة التغييرات
  useEffect(() => {
    console.log('🎯 حالة القائمة:', { isOpen, searchResults: searchResults.length, isLoading, value });
  }, [isOpen, searchResults, isLoading, value]);

  const handleCustomerSelect = (customer: Customer) => {
    onChange(customer.name);
    setIsOpen(false);
    onCustomerSelect?.(customer);
  };

  const handleInputFocus = () => {
    if (value.length >= 2) {
      searchCustomers(value);
      setIsOpen(true);
    }
  };

  const handleClearSearch = () => {
    onChange('');
    setSearchResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          className="pr-10 pl-10"
          dir="rtl"
        />
        {value && (
          <button
            onClick={handleClearSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* قائمة النتائج */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="p-3 text-center text-gray-500">
              <div className="animate-spin inline-block h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
              <span className="mr-2">جاري البحث...</span>
            </div>
          )}

          {!isLoading && searchResults.length === 0 && value.length >= 2 && (
            <div className="p-3 text-center text-gray-500">
              <User className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">لم يتم العثور على عملاء</p>
              {showAddButton && (
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onAddNew?.();
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  إضافة عميل جديد
                </Button>
              )}
            </div>
          )}

          {!isLoading && searchResults.map((customer) => (
            <div
              key={customer.id}
              onClick={() => handleCustomerSelect(customer)}
              className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    <span>{customer.phone}</span>
                    {customer.lastVisit && (
                      <span className="mr-3">آخر زيارة: {customer.lastVisit}</span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  اختيار
                </div>
              </div>
            </div>
          ))}

          {/* زر إضافة عميل جديد */}
          {!isLoading && value.length >= 2 && showAddButton && (
            <div className="p-3 border-t border-gray-100">
              <Button
                onClick={() => {
                  setIsOpen(false);
                  onAddNew?.();
                }}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                إضافة "{value}" كعميل جديد
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}