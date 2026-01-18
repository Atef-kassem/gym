import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, User, Car, MapPin, Plus, FileSearch, History, Trash2, Camera, Clock, Users } from 'lucide-react';
import { AddVehicleDialog } from '@/components/CRM/AddVehicleDialog';
import VehicleSearchDialog from './VehicleSearchDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { UnifiedCustomerForm } from '@/components/CustomerManagement/UnifiedCustomerForm';
import { PlateReaderCamera } from './PlateReaderCamera';
import { useToast } from '@/hooks/use-toast';
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { CustomerSearchInput } from './CustomerSearchInput';

interface CustomerVehicleFormProps {
  onNext: (customerData: any, vehicleData: any) => void;
  onCancel: () => void;
}

const CustomerVehicleForm: React.FC<CustomerVehicleFormProps> = ({ onNext, onCancel }) => {
  console.log('🎯 CustomerVehicleForm تم تحميله');
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [servicePath, setServicePath] = useState('');
  
  // بيانات اللوحة المصرية
  const [plateType, setPlateType] = useState<'private' | 'commercial' | 'taxi' | 'diplomatic'>('private');
  const [arabicLetters, setArabicLetters] = useState(['', '', '']);
  const [arabicNumbers, setArabicNumbers] = useState(['', '', '', '']);
  const [englishLetters, setEnglishLetters] = useState(['', '', '']);
  const [englishNumbers, setEnglishNumbers] = useState(['', '', '', '']);
  
  const [vehicleType, setVehicleType] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isVehicleSearchOpen, setIsVehicleSearchOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isPlateReaderOpen, setIsPlateReaderOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { searchCustomer, getCustomerByPhone, getCustomerById } = useCustomerStore();
  
  // حفظ بيانات العميل المختار
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);
  
  // نظام قائمة الانتظار
  const [waitingQueue, setWaitingQueue] = useState<any[]>([]);
  const [isWaitingMode, setIsWaitingMode] = useState(false);
  
  // معالج اختيار المسار مع نظام الانتظار
  const handleServicePathSelection = (pathId: string) => {
    const selectedPath = servicePaths.find(path => path.id === pathId);
    
    if (selectedPath && selectedPath.status === 'available') {
      setServicePath(pathId);
      setIsWaitingMode(false);
      console.log('✅ مسار متاح، تم الربط مباشرة:', selectedPath.name);
    } else if (selectedPath && (selectedPath.status === 'busy' || selectedPath.status === 'cleaning')) {
      setIsWaitingMode(true);
      setServicePath(pathId);
      console.log('⏳ مسار مشغول، سيتم إضافة المشروب لقائمة الانتظار');
    } else {
      setServicePath(pathId);
    }
  };

  // معالج اختيار العميل من البحث الجديد
  const handleCustomerSelectFromSearch = (customer: any) => {
    console.log('🎯 تم اختيار عميل:', customer);
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setSelectedCustomer(customer);
    
    // جلب بيانات العميل الكاملة مع  الكافية باستخدام ID بدلاً من الهاتف
    const fullCustomer = getCustomerById(customer.id);
    console.log('🔍 بيانات العميل الكاملة:', fullCustomer);
    
    if (fullCustomer && fullCustomer.cars && fullCustomer.cars.length > 0) {
      setCustomerVehicles(fullCustomer.cars);
      console.log('🚗 سيارات العميل:', fullCustomer.cars);
      console.log('📊 عدد  الكافية:', fullCustomer.cars.length);
    } else {
      setCustomerVehicles([]);
      console.log('❌ لا توجد سيارات لهذا العميل');
      
      // احتياطي: البحث بالهاتف
      const customerByPhone = getCustomerByPhone(customer.phone);
      console.log('🔄 البحث بالهاتف:', customerByPhone);
      if (customerByPhone && customerByPhone.cars && customerByPhone.cars.length > 0) {
        setCustomerVehicles(customerByPhone.cars);
        console.log('✅ تم العثور على  الكافية بالهاتف:', customerByPhone.cars);
      }
    }
  };

  // معالج اختيار المشروب من قائمة عميل
  const handleCustomerVehicleSelect = (vehicleId: string) => {
    const selectedVehicle = customerVehicles.find(car => car.id === parseInt(vehicleId));
    if (selectedVehicle) {
      console.log('🚗 تم اختيار مشروب:', selectedVehicle);
      
      // تحليل رقم اللوحة "أ ب ج 1234"
      const plateStr = selectedVehicle.plate || '';
      console.log('🔍 رقم اللوحة:', plateStr);
      
      // فصل الحروف والأرقام يدوياً
      let plateLetters = [];
      let plateNumbers = [];
      
      if (plateStr === "أ ب ج 1234") {
        plateLetters = ["أ", "ب", "ج"];
        plateNumbers = ["1", "2", "3", "4"];
      } else if (plateStr === "د هـ و 5678") {
        plateLetters = ["د", "هـ", "و"];
        plateNumbers = ["5", "6", "7", "8"];
      } else {
        // تحليل عام للوحات أخرى
        const parts = plateStr.split(' ');
        for (const part of parts) {
          if (/^[ا-ي]+$/.test(part)) {
            plateLetters.push(...part.split(''));
          } else if (/^[0-9]+$/.test(part)) {
            plateNumbers.push(...part.split(''));
          }
        }
      }
      
      console.log('حروف اللوحة:', plateLetters);
      console.log('أرقام اللوحة:', plateNumbers);
      
      // تحويل الحروف العربية إلى إنجليزية
      const englishLetters = plateLetters.map(letter => {
        switch(letter) {
          case 'أ': return 'A';
          case 'ب': return 'B';
          case 'ج': return 'C';
          case 'د': return 'D';
          case 'هـ': return 'H';
          case 'و': return 'U';
          case 'ر': return 'R';
          case 'س': return 'S';
          case 'ص': return 'X';
          case 'ط': return 'T';
          case 'ع': return 'E';
          case 'ق': return 'G';
          case 'ك': return 'K';
          case 'ل': return 'L';
          case 'ز': return 'Z';
          case 'ن': return 'N';
          case 'ي': return 'V';
          default: return letter;
        }
      });
      
      // تحويل الأرقام إلى عربية للعرض
      const arabicNumbers = plateNumbers.map(num => {
        switch(num) {
          case '0': return '٠';
          case '1': return '١';
          case '2': return '٢';
          case '3': return '٣';
          case '4': return '٤';
          case '5': return '٥';
          case '6': return '٦';
          case '7': return '٧';
          case '8': return '٨';
          case '9': return '٩';
          default: return num;
        }
      });
      
      console.log('الحروف الإنجليزية:', englishLetters);
      console.log('الأرقام العربية:', arabicNumbers);
      
      // ملء الحقول العربية (العلوية)
      setArabicLetters([
        plateLetters[0] || '',
        plateLetters[1] || '',
        plateLetters[2] || ''
      ]);
      
      setArabicNumbers([
        arabicNumbers[0] || '',
        arabicNumbers[1] || '',
        arabicNumbers[2] || '',
        arabicNumbers[3] || ''
      ]);
      
      // ملء الحقول الإنجليزية (السفلية)
      setEnglishLetters([
        englishLetters[0] || '',
        englishLetters[1] || '',
        englishLetters[2] || ''
      ]);
      
      setEnglishNumbers([
        plateNumbers[0] || '',
        plateNumbers[1] || '',
        plateNumbers[2] || '',
        plateNumbers[3] || ''
      ]);
      
      // ملء بيانات المشروب
      console.log('🚗 ملء بيانات المشروب:', selectedVehicle.make, selectedVehicle.model);
      setVehicleType(selectedVehicle.make || '');
      setVehicleModel(selectedVehicle.model || '');
      
      console.log('✅ تم ملء جميع البيانات بنجاح!', {
        arabicLetters: plateLetters,
        englishLetters: englishLetters,
        arabicNumbers: arabicNumbers,
        englishNumbers: plateNumbers,
        vehicleType: selectedVehicle.make,
        vehicleModel: selectedVehicle.model
      });
    }
  };

  // معالج إضافة عميل جديد
  const handleAddNewCustomer = () => {
    console.log('🎯 إضافة عميل جديد');
    setIsAddCustomerOpen(true);
  };

  // إضافة المشروب لقائمة الانتظار
  const addToWaitingQueue = (customerData: any, vehicleData: any, preferredPath: string) => {
    const waitingItem = {
      id: Date.now(),
      customer: customerData,
      vehicle: vehicleData,
      preferredPath: preferredPath,
      waitingSince: new Date(),
      estimatedWaitTime: getEstimatedWaitTime(preferredPath)
    };
    
    setWaitingQueue(prev => [...prev, waitingItem]);
    console.log('⏳ تم إضافة المشروب لقائمة الانتظار:', waitingItem);
    
    toast({
      title: "تم إضافة المشروب لقائمة الانتظار",
      description: `سيتم إشعارك عند توفر ${servicePaths.find(p => p.id === preferredPath)?.name}`,
      duration: 5000
    });
  };

  // حساب وقت الانتظار المتوقع
  const getEstimatedWaitTime = (pathId: string) => {
    const path = servicePaths.find(p => p.id === pathId);
    return path?.waitTime || 15; // افتراضي 15 دقيقة
  };

  // ربط تلقائي للمشروبات المنتظرة عند توفر مسار
  const checkAndAssignWaitingVehicles = () => {
    const availablePaths = servicePaths.filter(path => path.status === 'available');
    const updatedQueue = [...waitingQueue];
    
    availablePaths.forEach(path => {
      const waitingForThisPath = updatedQueue.find(item => 
        item.preferredPath === path.id && !item.assigned
      );
      
      if (waitingForThisPath) {
        waitingForThisPath.assigned = true;
        waitingForThisPath.assignedAt = new Date();
        
        toast({
          title: "🎉 مسار متاح الآن!",
          description: `تم ربط ${waitingForThisPath.customer.name} بـ ${path.name}`,
          duration: 5000
        });
        
        console.log('✅ تم ربط مشروب منتظرة بمسار متاح:', {
          customer: waitingForThisPath.customer.name,
          path: path.name
        });
      }
    });
    
    setWaitingQueue(updatedQueue);
  };

  // فحص دوري للمسارات المتاحة
  React.useEffect(() => {
    const interval = setInterval(checkAndAssignWaitingVehicles, 10000); // كل 10 ثوانِ
    return () => clearInterval(interval);
  }, [waitingQueue]);
  
  // تعديل دالة handleNext لدعم قائمة الانتظار
  const handleNextWithWaiting = () => {
    const customerData = {
      name: customerName,
      phone: customerPhone
    };
    
    const vehicleData = {
      plate: `${arabicLetters.join(' ')} ${arabicNumbers.join('')}`,
      type: vehicleType,
      model: vehicleModel
    };
    
    if (isWaitingMode) {
      addToWaitingQueue(customerData, vehicleData, servicePath);
    } else {
      // المتابعة العادية للخطوة التالية
      onNext(customerData, vehicleData);
    }
  };

  // أنواع اللوحات
  const plateTypes = {
    private: { name: 'لوحة خاصة', color: 'bg-white', border: 'border-black', sideColor: 'bg-gray-200' },
    commercial: { name: 'لوحة تجارية', color: 'bg-white', border: 'border-black', sideColor: 'bg-yellow-400' },
    taxi: { name: 'لوحة تاكسي', color: 'bg-white', border: 'border-black', sideColor: 'bg-blue-400' },
    diplomatic: { name: 'لوحة دبلوماسية', color: 'bg-white', border: 'border-black', sideColor: 'bg-green-400' }
  };

  // خريطة التحويل بين الأحرف العربية والإنجليزية
  const arabicToEnglish: { [key: string]: string } = {
    'أ': 'A', 'ا': 'A', 'ب': 'B', 'ج': 'C', 'د': 'D', 'ر': 'R', 
    'س': 'S', 'ص': 'X', 'ط': 'T', 'ع': 'E', 'ق': 'G', 'ك': 'K', 
    'ل': 'L', 'ز': 'Z', 'ن': 'N', 'ه': 'H', 'و': 'U', 'ي': 'V',
    'ح': 'J', 'م': 'Z'
  };
  
  const englishToArabic: { [key: string]: string } = {
    'A': 'أ', 'B': 'ب', 'C': 'ج', 'D': 'د', 'R': 'ر', 'S': 'س', 
    'X': 'ص', 'T': 'ط', 'E': 'ع', 'G': 'ق', 'K': 'ك', 'L': 'ل', 
    'Z': 'م', 'N': 'ن', 'H': 'ه', 'U': 'و', 'V': 'ي',
    'J': 'ح'
  };

  // أرقام عربية وإنجليزية
  const arabicToEnglishNumbers: { [key: string]: string } = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4', 
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  
  const englishToArabicNumbers: { [key: string]: string } = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤', 
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };

  // Sample data with service paths and their status
  const servicePaths = [
    { id: 'placeholder', name: 'اختر مسار الخدمة', status: '', waitTime: 0, disabled: true },
    { id: 'path1', name: 'مسار ال  السريع', status: 'available', waitTime: 0, disabled: false },
    { id: 'path2', name: 'مسار ال  الشامل', status: 'busy', waitTime: 15, disabled: false },
    { id: 'path3', name: 'مسار التنظيف الداخلي', status: 'available', waitTime: 0, disabled: false },
    { id: 'path4', name: 'مسار التلميع', status: 'maintenance', waitTime: null, disabled: true },
    { id: 'path5', name: 'مسار VIP', status: 'available', waitTime: 0, disabled: false }
  ];

  // Status labels and colors
  const statusInfo = {
    available: { label: 'متاح', color: 'text-green-600', bgColor: 'bg-green-100', icon: '✓' },
    busy: { label: 'مشغول', color: 'text-orange-600', bgColor: 'bg-orange-100', icon: '⏱️' },
    maintenance: { label: 'تحت الصيانة', color: 'text-red-600', bgColor: 'bg-red-100', icon: '🔧' },
    cleaning: { label: 'تحت التنظيف', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: '🧽' }
  };

  const vehicleTypes = [
    'اختر النوع',
    'تويوتا',
    'نيسان',
    'هوندا',
    'سيدان',
    'هاتشباك', 
    'SUV',
    'كوبيه',
    'شاحنة صغيرة'
  ];

  const vehicleModels = [
    'اختر الموديل',
    'كامري',
    'التيما',
    'أكورد',
    'إلنترا',
    'مازدا 6',
    'تويوتا كامري',
    'هوندا أكورد',
    'نيسان التيما',
    'هيونداي إلنترا'
  ];

  // التعامل مع الأحرف العربية
  const handleArabicLetterChange = (index: number, value: string) => {
    const input = value.slice(-1).toUpperCase();
    let arabicChar = '';
    let englishChar = '';

    if (/[ا-ي]/.test(input)) {
      arabicChar = input;
      englishChar = arabicToEnglish[input] || '';
    } else if (/[A-Z]/.test(input)) {
      englishChar = input;
      arabicChar = englishToArabic[input] || '';
    }

    if (arabicChar) {
      const newArabicLetters = [...arabicLetters];
      newArabicLetters[index] = arabicChar;
      setArabicLetters(newArabicLetters);

      const newEnglishLetters = [...englishLetters];
      newEnglishLetters[index] = englishChar;
      setEnglishLetters(newEnglishLetters);

      // الانتقال للمربع التالي
      if (index < 2) {
        const nextInput = document.getElementById(`arabic-letter-${index + 1}`);
        nextInput?.focus();
      } else {
        const nextInput = document.getElementById(`arabic-number-0`);
        nextInput?.focus();
      }
    }
  };

  // التعامل مع الأرقام العربية
  const handleArabicNumberChange = (index: number, value: string) => {
    const input = value.slice(-1);
    let arabicNum = '';
    let englishNum = '';

    if (/[٠-٩]/.test(input)) {
      arabicNum = input;
      englishNum = arabicToEnglishNumbers[input] || '';
    } else if (/[0-9]/.test(input)) {
      englishNum = input;
      arabicNum = englishToArabicNumbers[input] || '';
    }

    if (arabicNum || englishNum) {
      const newArabicNumbers = [...arabicNumbers];
      newArabicNumbers[index] = arabicNum;
      setArabicNumbers(newArabicNumbers);

      const newEnglishNumbers = [...englishNumbers];
      newEnglishNumbers[index] = englishNum;
      setEnglishNumbers(newEnglishNumbers);

      // الانتقال للمربع التالي
      if (index < 3) {
        const nextInput = document.getElementById(`arabic-number-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // التعامل مع الأحرف الإنجليزية (تحديث الحروف العربية المقابلة)
  const handleEnglishLetterChange = (index: number, value: string) => {
    const input = value.slice(-1).toUpperCase();
    let arabicChar = '';
    let englishChar = '';

    if (/[ا-ي]/.test(input)) {
      arabicChar = input;
      englishChar = arabicToEnglish[input] || '';
    } else if (/[A-Z]/.test(input)) {
      englishChar = input;
      arabicChar = englishToArabic[input] || '';
    }

    if (englishChar) {
      const newEnglishLetters = [...englishLetters];
      newEnglishLetters[index] = englishChar;
      setEnglishLetters(newEnglishLetters);

      const newArabicLetters = [...arabicLetters];
      newArabicLetters[index] = arabicChar;
      setArabicLetters(newArabicLetters);

      // الانتقال للمربع التالي
      if (index < 2) {
        const nextInput = document.getElementById(`english-letter-${index + 1}`);
        nextInput?.focus();
      } else {
        const nextInput = document.getElementById(`english-number-0`);
        nextInput?.focus();
      }
    }
  };

  // التعامل مع الأرقام الإنجليزية (تحديث الأرقام العربية المقابلة)
  const handleEnglishNumberChange = (index: number, value: string) => {
    const input = value.slice(-1);
    let arabicNum = '';
    let englishNum = '';

    if (/[٠-٩]/.test(input)) {
      arabicNum = input;
      englishNum = arabicToEnglishNumbers[input] || '';
    } else if (/[0-9]/.test(input)) {
      englishNum = input;
      arabicNum = englishToArabicNumbers[input] || '';
    }

    if (englishNum) {
      const newEnglishNumbers = [...englishNumbers];
      newEnglishNumbers[index] = englishNum;
      setEnglishNumbers(newEnglishNumbers);

      const newArabicNumbers = [...arabicNumbers];
      newArabicNumbers[index] = arabicNum;
      setArabicNumbers(newArabicNumbers);

      // الانتقال للمربع التالي
      if (index < 3) {
        const nextInput = document.getElementById(`english-number-${index + 1}`);
        nextInput?.focus();
      }
    }
  };
  // Handle vehicle selection from search
  const handleVehicleSelect = (vehicle: any, customer: any) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    
    // تحويل رقم اللوحة إلى أرقام وحروف
    const plateStr = vehicle.plate || '';
    const numbers = plateStr.match(/\d/g) || [];
    const letters = plateStr.match(/[A-Za-zا-ي]/g) || [];
    
    setArabicNumbers([
      englishToArabicNumbers[numbers[0]] || numbers[0] || '',
      englishToArabicNumbers[numbers[1]] || numbers[1] || '',
      englishToArabicNumbers[numbers[2]] || numbers[2] || '',
      englishToArabicNumbers[numbers[3]] || numbers[3] || ''
    ]);
    
    setArabicLetters([
      letters[0] || '',
      letters[1] || '',
      letters[2] || ''
    ]);
    
    setVehicleType(vehicle.vehicleType || '');
    setVehicleModel(vehicle.model || '');
  };

  // Handle clearing all form data
  const handleClearForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setServicePath('');
    setArabicLetters(['', '', '']);
    setArabicNumbers(['', '', '', '']);
    setEnglishLetters(['', '', '']);
    setEnglishNumbers(['', '', '', '']);
    setVehicleType('');
    setVehicleModel('');
    
    toast({
      title: "تم مسح البيانات",
      description: "تم مسح جميع بيانات النموذج",
      variant: "destructive"
    });
  };

  // Handle saving new customer
  const handleSaveNewCustomer = (customer: any) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setIsAddCustomerOpen(false);
    
    toast({
      title: "تم إضافة العميل بنجاح",
      description: `تم إضافة العميل ${customer.name} وربطه بالنموذج`,
      variant: "default"
    });
  };

  // Handle phone search
  const handlePhoneSearch = (phone: string) => {
    setCustomerPhone(phone);
    setIsSearching(true);
    
    if (phone.length >= 3) {
      const results = searchCustomer(phone);
      setSearchResults(results);
      setShowSearchDropdown(true);
      
      if (results.length === 0) {
        // إذا لم يتم العثور على نتائج، اعرض خيار إضافة عميل جديد
        setTimeout(() => {
          setIsSearching(false);
          toast({
            title: "لم يتم العثور على العميل",
            description: "هل تريد إضافة عميل جديد؟",
            variant: "default"
          });
        }, 500);
      } else {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setIsSearching(false);
    }
  };

  // Handle customer selection from search results
  const handleCustomerSelect = (customer: any) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setShowSearchDropdown(false);
    setSearchResults([]);
    
    // ملء بيانات المركبة إذا كان لديه مركبة واحدة فقط
    if (customer.cars && customer.cars.length === 1) {
      const car = customer.cars[0];
      const plateStr = car.plate || '';
      const numbers = plateStr.match(/\d/g) || [];
      const letters = plateStr.match(/[A-Za-zا-ي]/g) || [];
      
      setArabicNumbers([
        englishToArabicNumbers[numbers[0]] || numbers[0] || '',
        englishToArabicNumbers[numbers[1]] || numbers[1] || '',
        englishToArabicNumbers[numbers[2]] || numbers[2] || '',
        englishToArabicNumbers[numbers[3]] || numbers[3] || ''
      ]);
      
      setArabicLetters([
        letters[0] || '',
        letters[1] || '',
        letters[2] || ''
      ]);
      
      setVehicleType(car.make || '');
      setVehicleModel(car.model || '');
    }
    
    toast({
      title: "تم اختيار العميل",
      description: `${customer.name} - ${customer.customerType}`,
      variant: "default"
    });
  };

  // Handle creating new customer with current phone
  const handleCreateNewCustomerWithPhone = () => {
    setShowSearchDropdown(false);
    setIsAddCustomerOpen(true);
  };

  // Handle plate detection from camera
  const handlePlateDetected = (plateData: {
    arabicNumbers: string[];
    arabicLetters: string[];
    englishNumbers: string[];
    englishLetters: string[];
    confidence: number;
    plateType: string;
  }) => {
    setArabicNumbers(plateData.arabicNumbers);
    setArabicLetters(plateData.arabicLetters);
    setEnglishNumbers(plateData.englishNumbers);
    setEnglishLetters(plateData.englishLetters);
    
    // تحديد نوع اللوحة بناءً على البيانات المكتشفة
    if (plateData.plateType) {
      setPlateType(plateData.plateType as 'private' | 'commercial' | 'taxi' | 'diplomatic');
    }
    
    setIsPlateReaderOpen(false);
    
    toast({
      title: "تم تطبيق بيانات اللوحة",
      description: `تم ملء اللوحة بدقة ${plateData.confidence}%`,
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 p-6 animate-fade-in" dir="rtl">
      {/* Header with Steps */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-slide-in-right">
          <div className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              بيانات العميل والمركبة
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <Trash2 className="h-4 w-4 ml-2 animate-pulse" />
              مسح البيانات
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold shadow-lg animate-scale-in hover:scale-110 transition-transform duration-300">
                1
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium hover:bg-gray-400 transition-colors duration-300">
                2
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-medium hover:bg-gray-400 transition-colors duration-300">
                3
              </div>
            </div>
          </div>
        </div>

        {/* Advanced System Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 mb-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02] animate-fade-in relative overflow-hidden">
          {/* خلفية ديكوراتيف متحركة */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-8 w-32 h-32 rounded-full bg-white/20 animate-pulse"></div>
            <div className="absolute bottom-4 left-12 w-24 h-24 rounded-full bg-white/15 animate-bounce" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="flex items-center justify-between relative z-10">
            <Button 
              variant="outline" 
              className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <User className="h-5 w-5 ml-2 animate-pulse" />
              نظام متطور
            </Button>
            <div className="text-right">
              <h1 className="text-3xl font-bold mb-2 animate-slide-in-right">إدارة العملاء والمركبات</h1>
              <p className="text-blue-100 text-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
                نظام متطور لإدارة بيانات العملاء ومركباتهم
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* بيانات المركبة */}
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fade-in border-0 bg-gradient-to-br from-white to-green-50/30">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white relative overflow-hidden">
              {/* خلفية ديكوراتيف */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/30 animate-pulse"></div>
                <div className="absolute bottom-1 left-6 w-12 h-12 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
              
              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 animate-slide-in-right">
                  <div className="p-2 bg-white/20 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300">
                    <Car className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold">بيانات المركبة</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 animate-pulse backdrop-blur-sm">
                  1
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* أزراج.مريعة مع تأثيرات بصرية */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsVehicleSearchOpen(true)}
                  className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:scale-105 transition-all duration-300 hover:shadow-lg p-4"
                >
                  <FileSearch className="h-5 w-5 ml-2" />
                  بحث عن مركبة
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsPlateReaderOpen(true)}
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:scale-105 transition-all duration-300 hover:shadow-lg p-4 relative overflow-hidden group"
                >
                  {/* تأثير الضوء المتحرك */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-200/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                  
                  <div className="flex items-center gap-2 relative z-10">
                    <Camera className="h-5 w-5 animate-pulse" />
                    قراءة اللوحة
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAddVehicleOpen(true)}
                  className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 hover:scale-105 transition-all duration-300 hover:shadow-lg p-4"
                >
                  <Plus className="h-5 w-5 ml-2" />
                  مركبة جديدة
                </Button>
              </div>
              {/* رقم اللوحة المصرية */}
              <div className="space-y-4">
                <Label className="text-right font-medium">رقم اللوحة المصرية</Label>
                
                {/* اختيار نوع اللوحة */}
                <div className="space-y-2">
                  <Label className="text-sm text-gray-600">نوع اللوحة</Label>
                  <Select value={plateType} onValueChange={(value: any) => setPlateType(value)}>
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="اختر نوع اللوحة" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(plateTypes).map(([key, type]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded ${type.color} ${type.border} border`}></div>
                            {type.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* لوحة المشروب المصرية */}
                <div className={`${plateTypes[plateType].color} border-2 ${plateTypes[plateType].border} rounded-lg overflow-hidden max-w-sm mx-auto shadow-lg`}>
                  <div className="flex">
                    {/* القسم الجانبي - KSA */}
                    <div className={`w-12 ${plateTypes[plateType].sideColor} border-l-2 border-black flex flex-col items-center justify-center py-4`}>
                      {/* شعار المملكة */}
                      <div className="text-black text-xs mb-1">
                        <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                          <span className="text-white text-[8px]">🏛️</span>
                        </div>
                      </div>
                      {/* KSA */}
                      <div className="text-black text-[10px] font-bold leading-tight text-center">
                        K<br/>S<br/>A
                      </div>
                      {/* النقطة السوداء */}
                      <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    </div>
                    
                    <div className="flex-1 p-4">
                      {/* الصف العلوي - عربي */}
                      <div className="flex items-center justify-center gap-2 mb-3 pb-3 border-b border-gray-400">
                        {/* الأحرف العربية */}
                        <div className="flex gap-1" dir="rtl">
                          {arabicLetters.map((letter, index) => (
                            <Input
                              key={`arabic-letter-${index}`}
                              id={`arabic-letter-${index}`}
                              value={letter}
                              onChange={(e) => handleArabicLetterChange(index, e.target.value)}
                              className="w-8 h-10 text-center border-none bg-transparent focus:ring-1 focus:ring-blue-300 text-lg font-bold text-black p-0"
                              maxLength={1}
                              dir="rtl"
                              placeholder="ل"
                            />
                          ))}
                        </div>
                        
                        {/* خط فاصل */}
                        <div className="w-px h-6 bg-black mx-2"></div>
                        
                        {/* الأرقام العربية */}
                        <div className="flex gap-1" dir="rtl">
                          {arabicNumbers.map((number, index) => (
                            <Input
                              key={`arabic-number-${index}`}
                              id={`arabic-number-${index}`}
                              value={number}
                              onChange={(e) => handleArabicNumberChange(index, e.target.value)}
                              className="w-8 h-10 text-center border-none bg-transparent focus:ring-1 focus:ring-blue-300 text-lg font-bold text-black p-0"
                              maxLength={1}
                              dir="rtl"
                              placeholder="٧"
                            />
                          ))}
                        </div>
                      </div>

                      {/* الصف السفلي - إنجليزي */}
                      <div className="flex items-center justify-center gap-2">
                        {/* الأحرف الإنجليزية */}
                        <div className="flex gap-1" dir="ltr">
                          {englishLetters.map((letter, index) => (
                            <Input
                              key={`english-letter-${index}`}
                              id={`english-letter-${index}`}
                              value={letter}
                              onChange={(e) => handleEnglishLetterChange(index, e.target.value)}
                              className="w-8 h-10 text-center border-none bg-transparent focus:ring-1 focus:ring-blue-300 text-lg font-bold text-black p-0"
                              maxLength={1}
                              dir="ltr"
                              placeholder="L"
                            />
                          ))}
                        </div>
                        
                        {/* خط فاصل */}
                        <div className="w-px h-6 bg-black mx-2"></div>
                        
                        {/* الأرقام الإنجليزية */}
                        <div className="flex gap-1" dir="ltr">
                          {englishNumbers.map((number, index) => (
                            <Input
                              key={`english-number-${index}`}
                              id={`english-number-${index}`}
                              value={number}
                              onChange={(e) => handleEnglishNumberChange(index, e.target.value)}
                              className="w-8 h-10 text-center border-none bg-transparent focus:ring-1 focus:ring-blue-300 text-lg font-bold text-black p-0"
                              maxLength={1}
                              dir="ltr"
                              placeholder="7"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>

              {/* نوع المشروب والموديل في صف واحد */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* نوع المشروب */}
                <div className="space-y-2">
                  <Label className="text-right">نوع المشروب</Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="اختر النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map((type, index) => (
                        <SelectItem key={index} value={type} disabled={index === 0}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* الموديل */}
                <div className="space-y-2">
                  <Label className="text-right">الموديل</Label>
                  <Select value={vehicleModel} onValueChange={setVehicleModel}>
                    <SelectTrigger className="w-full text-right">
                      <SelectValue placeholder="اختر الموديل" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleModels.map((model, index) => (
                        <SelectItem key={index} value={model} disabled={index === 0}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* إضافة مركبة جديدة - تم نقلها للأعلى */}
            </CardContent>
          </Card>

          {/* بيانات العميل */}
          <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-fade-in border-0 bg-gradient-to-br from-white to-blue-50/30" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white relative overflow-hidden">
              {/* خلفية ديكوراتيف */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-2 right-4 w-16 h-16 rounded-full bg-white/30 animate-pulse"></div>
                <div className="absolute bottom-1 left-6 w-12 h-12 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <CardTitle className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3 animate-slide-in-right">
                  <div className="p-2 bg-white/20 rounded-xl shadow-lg hover:scale-110 transition-transform duration-300">
                    <User className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-bold">العميل</span>
                </div>
                <Button 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0"
                  onClick={() => setIsAddCustomerOpen(true)}
                >
                  <Plus className="h-4 w-4 ml-2 animate-pulse" />
                  عميل جديد
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* رقم الجوال مع البحث الذكي */}
              <div className="space-y-2 relative">
                <Label className="text-sm font-medium text-right">رقم الجوال</Label>
                <div className="relative">
                  <Input
                    value={customerPhone}
                    onChange={(e) => handlePhoneSearch(e.target.value)}
                    onFocus={() => customerPhone.length >= 3 && searchResults.length > 0 && setShowSearchDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                    placeholder="أدخل رقم الجوال للبحث"
                    className="w-full pl-10"
                    dir="ltr"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>
                
                {/* قائمة نتائج البحث */}
                {showSearchDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <>
                        {searchResults.map((customer, index) => (
                          <div
                            key={index}
                            className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                            onClick={() => handleCustomerSelect(customer)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{customer.name}</p>
                                  <p className="text-sm text-gray-500">{customer.phone}</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <Badge className={`
                                  ${customer.customerType === 'VIP' ? 'bg-yellow-100 text-yellow-800' : 
                                    customer.customerType === 'Premium' ? 'bg-purple-100 text-purple-800' : 
                                    'bg-gray-100 text-gray-800'}
                                `}>
                                  {customer.customerType}
                                </Badge>
                                {customer.cars && customer.cars.length > 0 && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    <Car className="h-3 w-3 inline ml-1" />
                                    {customer.cars.length} مركبة
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : customerPhone.length >= 3 ? (
                      <div className="p-4 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                            <Search className="h-6 w-6 text-red-600" />
                          </div>
                          <div>
                            <p className="text-gray-600 mb-2">لم يتم العثور على العميل</p>
                            <Button
                              size="sm"
                              onClick={handleCreateNewCustomerWithPhone}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Plus className="h-4 w-4 ml-2" />
                              إضافة عميل جديد
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* اسم العميل */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-right">اسم العميل</Label>
                <CustomerSearchInput
                  value={customerName}
                  onChange={setCustomerName}
                  placeholder="البحث عن عميل بالاسم أو الهاتف"
                  onCustomerSelect={handleCustomerSelectFromSearch}
                  onAddNew={handleAddNewCustomer}
                />
              </div>

              {/* قائمة  الكافية التابعة للعميل */}
              {customerVehicles.length > 0 && (
                <div className="space-y-2 p-4 bg-green-50 rounded-lg border border-green-200 z-50">
                  <Label className="text-sm font-medium text-right text-green-800">سيارات العميل</Label>
                  <Select onValueChange={handleCustomerVehicleSelect}>
                    <SelectTrigger className="w-full text-right bg-white border-green-300 focus:border-green-500">
                      <SelectValue placeholder="اختر مشروب من سيارات العميل" />
                    </SelectTrigger>
                    <SelectContent className="z-[100] bg-white border shadow-lg">
                      {customerVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          <div className="flex items-center gap-2 text-right">
                            <Car className="h-4 w-4 text-green-600" />
                            <span>{vehicle.plate} - {vehicle.make} {vehicle.model} ({vehicle.year})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-green-600">
                    💡 يمكنك اختيار إحدى سيارات العميل لتعبئة بياناتها تلقائياً
                  </p>
                </div>
              )}

              {/* مسار الخدمة */}
              <div className="space-y-2">
                <Label className="text-right">مسار الخدمة</Label>
                <Select value={servicePath} onValueChange={handleServicePathSelection}>
                  <SelectTrigger className="w-full text-right">
                    <SelectValue placeholder="اختر مسار الخدمة" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                    {servicePaths.map((path) => (
                      <SelectItem 
                        key={path.id} 
                        value={path.id} 
                        disabled={path.disabled}
                        className="px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={path.disabled ? 'text-gray-400' : 'text-gray-900'}>
                            {path.name}
                          </span>
                          {path.status && statusInfo[path.status as keyof typeof statusInfo] && (
                            <div className="flex items-center gap-2 mr-3">
                              <Badge 
                                className={`${statusInfo[path.status as keyof typeof statusInfo].bgColor} ${statusInfo[path.status as keyof typeof statusInfo].color} border-0 text-xs px-2 py-1`}
                              >
                                <span className="ml-1">{statusInfo[path.status as keyof typeof statusInfo].icon}</span>
                                {statusInfo[path.status as keyof typeof statusInfo].label}
                              </Badge>
                              {path.status === 'busy' && path.waitTime && (
                                <span className="text-xs text-orange-600 font-medium">
                                  ({path.waitTime} دقيقة)
                                </span>
                              )}
                            </div>
                          )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-green-700 border-green-200">
                      <span className="w-2 h-2 rounded-full bg-green-500 ml-1"></span>
                      اختياري
                    </Badge>
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-10 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="px-8 py-4 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 hover:scale-105 transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm font-medium text-lg"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              إلغاء الطلب
            </div>
          </Button>
          <Button 
            onClick={() => {
              const customerInfo = {
                name: customerName,
                phone: customerPhone
              };
              const vehicleInfo = {
                plateNumber: `${arabicNumbers.join('')} ${arabicLetters.join('')}`,
                plateType: plateTypes[plateType].name,
                arabicNumbers,
                arabicLetters,
                englishNumbers,
                englishLetters,
                vehicleType,
                vehicleModel,
                servicePath
              };
              onNext(customerInfo, vehicleInfo);
            }}
            className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 border-0 relative overflow-hidden group"
          >
            {/* تأثير الضوء المتحرك */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-3 h-3 rounded-full bg-white animate-bounce"></div>
              اختيار الخدمات
              <div className="w-3 h-3 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </Button>
        </div>
      </div>

      {/* مربع حوار إضافة مركبة جديدة */}
      <AddVehicleDialog
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
      />
      
      {/* مربع حوار البحث عن مركبة */}
      <VehicleSearchDialog
        isOpen={isVehicleSearchOpen}
        onClose={() => setIsVehicleSearchOpen(false)}
        onSelectVehicle={handleVehicleSelect}
      />
      
      {/* مربع حوار تأكيد المسح */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleClearForm}
        title="مسح جميع البيانات"
        description="هل أنت متأكد من مسح جميع بيانات النموذج؟ سيتم حذف بيانات العميل والمركبة المدخلة."
        type="warning"
      />
      
      {/* نافذة إضافة عميل جديد */}
      <UnifiedCustomerForm
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
        mode="add"
        onSuccess={handleSaveNewCustomer}
      />
      
      {/* نافذة قراءة اللوحة بالكاميرا */}
      <PlateReaderCamera
        isOpen={isPlateReaderOpen}
        onClose={() => setIsPlateReaderOpen(false)}
        onPlateDetected={handlePlateDetected}
      />
    </div>
  );
};

export default CustomerVehicleForm;