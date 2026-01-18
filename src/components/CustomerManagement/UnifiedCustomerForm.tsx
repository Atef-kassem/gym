import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  UserPlus, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Car,
  Plus,
  Trash2,
  Save,
  X,
  Crown,
  Star,
  Shield,
  Camera,
  Upload,
  Building2,
  Users,
  Briefcase,
  FileText,
  Hash,
  Globe,
  Eye
} from 'lucide-react';
import { Customer, CustomerFormData, Car as CarType, Contact, RelatedPerson } from '@/types/customer';
import { useCustomerStore } from '@/hooks/useCustomerStore';
import { SafeImage } from '@/components/ui/safe-image';
import { validateFileSize, validateFileType, fileToUrl, revokeObjectUrl } from '@/utils/image-utils';

interface UnifiedCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null; // للتعديل
  mode?: 'add' | 'edit';
  onSuccess?: (customer: Customer) => void;
}

export function UnifiedCustomerForm({ 
  isOpen, 
  onClose, 
  customer = null, 
  mode = 'add',
  onSuccess 
}: UnifiedCustomerFormProps) {
  const { toast } = useToast();
  const { addCustomer, updateCustomer } = useCustomerStore();
  
  const [customerData, setCustomerData] = useState<CustomerFormData & { avatarFile?: File }>({
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    customerType: 'Individual',
    notes: '',
    avatar: '/api/placeholder/100/100', // استخدام placeholder محلي
    cars: [{
      id: 1,
      plate: '',
      make: '',
      model: '',
      year: '',
      color: '',
      fuelType: '',
      transmission: '',
      engineSize: '',
      vehicleType: '',
      chassisNumber: '',
      odometerReading: 0,
      recommendedOilQuantity: 0,
      notes: ''
    }],
    contacts: [{ id: 1, type: 'جوال', value: '' }],
    relatedCustomers: []
  });

  // حالة معاينة الصورة
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);

  // نوع العميل: فرد، شركة، مجموعة
  const [clientType, setClientType] = useState<'individual' | 'company' | 'group'>('individual');

  // تحميل بيانات العميل للتعديل
  useEffect(() => {
    if (customer && mode === 'edit') {
      // التحقق من صحة صورة العميل
      const validateAvatar = (avatarUrl: string) => {
        if (!avatarUrl || avatarUrl === '' || avatarUrl.includes('unsplash.com')) {
          return '/api/placeholder/100/100';
        }
        return avatarUrl;
      };

      setCustomerData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || '',
        address: customer.address || '',
        birthDate: customer.birthDate || '',
        customerType: customer.customerType,
        notes: customer.notes || '',
        avatar: validateAvatar(customer.avatar),
        cars: customer.cars.length > 0 ? customer.cars : [{
          id: 1,
          plate: '',
          make: '',
          model: '',
          year: '',
          color: '',
          fuelType: '',
          transmission: '',
          engineSize: '',
          vehicleType: '',
          chassisNumber: '',
          odometerReading: 0,
          recommendedOilQuantity: 0,
          notes: ''
        }],
        contacts: customer.contacts.length > 0 ? customer.contacts : [{ id: 1, type: 'جوال', value: customer.phone }],
        relatedCustomers: customer.relatedCustomers || []
      });
    } else {
      // إعادة تعيين النموذج للإضافة
      setCustomerData({
        name: '',
        phone: '',
        email: '',
        address: '',
        birthDate: '',
        customerType: 'Individual',
        notes: '',
        avatar: '/api/placeholder/100/100', // استخدام placeholder محلي
        cars: [{
          id: 1,
          plate: '',
          make: '',
          model: '',
          year: '',
          color: '',
          fuelType: '',
          transmission: '',
          engineSize: '',
          vehicleType: '',
          chassisNumber: '',
          odometerReading: 0,
          recommendedOilQuantity: 0,
          notes: ''
        }],
        contacts: [{ id: 1, type: 'جوال', value: '' }],
        relatedCustomers: []
      });
    }
  }, [customer, mode, isOpen]);

  const customerTypes = [
    { value: 'Individual', label: 'عميل فردي', icon: User, color: 'bg-blue-500' },
    { value: 'Company', label: 'شركة', icon: Shield, color: 'bg-green-500' },
    { value: 'Group', label: 'مجموعة', icon: Crown, color: 'bg-purple-500' }
  ];

  const carMakes = [
    'تويوتا', 'نيسان', 'هيونداي', 'كيا', 'هوندا', 'فورد', 'شفروليه', 'BMW', 'مرسيدس', 'أودي', 'لكزس', 'انفينيتي'
  ];

  const carColors = [
    'أبيض', 'أسود', 'فضي', 'رمادي', 'أحمر', 'أزرق', 'أخضر', 'بني', 'ذهبي', 'بيج'
  ];

  const fuelTypes = ['بنزين', 'ديزل', 'هجين', 'كهربائي'];
  const transmissionTypes = ['عادي', 'أوتوماتيك', 'CVT'];

  const relationTypes = [
    'أب', 'أم', 'أخ', 'أخت', 'زوج', 'زوجة', 'ابن', 'ابنة', 'صديق', 'قريب', 'زميل'
  ];

  const contactTypes = [
    'جوال', 'هاتف منزل', 'هاتف عمل', 'واتساب', 'تلغرام'
  ];

  // دالة للحصول على لون CSS للون المشروب
  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'أبيض': 'bg-white',
      'أسود': 'bg-black',
      'فضي': 'bg-gray-300',
      'رمادي': 'bg-gray-500',
      'أحمر': 'bg-red-500',
      'أزرق': 'bg-blue-500',
      'أخضر': 'bg-green-500',
      'بني': 'bg-yellow-800',
      'ذهبي': 'bg-yellow-400',
      'بيج': 'bg-yellow-100'
    };
    return colorMap[color] || 'bg-gray-200';
  };

  // دالة للحصول على لون أيقونة نوع الوقود
  const getFuelIconColor = (fuel: string) => {
    const fuelColorMap: { [key: string]: string } = {
      'بنزين': 'bg-red-500',
      'ديزل': 'bg-blue-600',
      'هجين': 'bg-green-500',
      'كهربائي': 'bg-purple-500'
    };
    return fuelColorMap[fuel] || 'bg-gray-400';
  };

  // دالة للحصول على لون أيقونة ناقل الحركة
  const getTransmissionIconColor = (trans: string) => {
    const transColorMap: { [key: string]: string } = {
      'عادي': 'bg-orange-500',
      'أوتوماتيك': 'bg-blue-500',
      'CVT': 'bg-green-500'
    };
    return transColorMap[trans] || 'bg-gray-400';
  };

  // إدارة  الكافية
  const addCar = () => {
    setCustomerData(prev => ({
      ...prev,
      cars: [...prev.cars, {
        id: Date.now(),
        plate: '',
        make: '',
        model: '',
        year: '',
        color: '',
        fuelType: '',
        transmission: '',
        engineSize: '',
        vehicleType: '',
        chassisNumber: '',
        odometerReading: 0,
        recommendedOilQuantity: 0,
        notes: ''
      }]
    }));
  };

  const removeCar = (id: number) => {
    setCustomerData(prev => ({
      ...prev,
      cars: prev.cars.filter(car => car.id !== id)
    }));
  };

  // دالة تحويل الحروف العربية إلى الإنجليزية
  const convertArabicToEnglish = (text: string): string => {
    const arabicToEnglishMap: { [key: string]: string } = {
      'ا': 'A', 'أ': 'A', 'إ': 'A', 'آ': 'A',
      'ب': 'B', 'ت': 'T', 'ث': 'TH',
      'ج': 'J', 'ح': 'H', 'خ': 'KH',
      'د': 'D', 'ذ': 'TH', 'ر': 'R', 'ز': 'Z',
      'س': 'S', 'ش': 'SH', 'ص': 'S', 'ض': 'D',
      'ط': 'T', 'ظ': 'Z', 'ع': 'A', 'غ': 'GH',
      'ف': 'F', 'ق': 'Q', 'ك': 'K', 'ل': 'L',
      'م': 'M', 'ن': 'N', 'ه': 'H', 'ة': 'H',
      'و': 'W', 'ي': 'Y', 'ى': 'Y'
    };
    
    return text.split('').map(char => arabicToEnglishMap[char] || char).join('');
  };

  const updateCar = (id: number, field: string, value: string | number) => {
    setCustomerData(prev => ({
      ...prev,
      cars: prev.cars.map(car => {
        if (car.id === id) {
          let processedValue = value;
          
          // إذا كان الحقل هو رقم اللوحة، قم بتحويل الحروف العربية إلى الإنجليزية
          if (field === 'plate' && typeof value === 'string') {
            const arabicLetters = value.match(/[أ-ي]/g);
            if (arabicLetters) {
              // احتفظ بالأرقام والحروف الإنجليزية، واحول العربية فقط
              const convertedValue = value.replace(/[أ-ي]/g, (match) => convertArabicToEnglish(match));
              processedValue = convertedValue;
            }
          }
          
          return {
            ...car,
            [field]: field === 'odometerReading' || field === 'recommendedOilQuantity' 
              ? (processedValue === '' ? 0 : Number(processedValue))
              : processedValue
          };
        }
        return car;
      })
    }));
  };

  // إدارة جهات الاتصال
  const addContact = () => {
    setCustomerData(prev => ({
      ...prev,
      contacts: [...prev.contacts, {
        id: Date.now(),
        type: 'جوال',
        value: ''
      }]
    }));
  };

  const removeContact = (id: number) => {
    if (customerData.contacts.length > 1) {
      setCustomerData(prev => ({
        ...prev,
        contacts: prev.contacts.filter(contact => contact.id !== id)
      }));
    }
  };

  const updateContact = (id: number, field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      contacts: prev.contacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    }));
  };

  // إدارة الأقارب
  const addRelatedPerson = () => {
    setCustomerData(prev => ({
      ...prev,
      relatedCustomers: [...prev.relatedCustomers, {
        id: Date.now(),
        name: '',
        phone: '',
        relation: ''
      }]
    }));
  };

  const removeRelatedPerson = (id: number) => {
    setCustomerData(prev => ({
      ...prev,
      relatedCustomers: prev.relatedCustomers.filter(person => person.id !== id)
    }));
  };

  const updateRelatedPerson = (id: number, field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      relatedCustomers: prev.relatedCustomers.map(person => 
        person.id === id ? { ...person, [field]: value } : person
      )
    }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!validateFileType(file)) {
        toast({
          title: "نوع ملف غير صحيح",
          description: "يرجى اختيار ملف صورة صحيح",
          variant: "destructive"
        });
        return;
      }

      // التحقق من حجم الملف (أقل من 5 ميجابايت)
      if (!validateFileSize(file, 5)) {
        toast({
          title: "حجم ملف كبير جداً",
          description: "يرجى اختيار صورة بحجم أقل من 5 ميجابايت",
          variant: "destructive"
        });
        return;
      }

      // إنشاء URL مؤقت للصورة
      const imageUrl = fileToUrl(file);
      
      // تحديث حالة الصورة
      const updatedData = {
        ...customerData,
        avatar: imageUrl,
        avatarFile: file
      };
      setCustomerData(updatedData);

      toast({
        title: "تم رفع الصورة بنجاح",
        description: "تم تحديث صورة العميل",
        variant: "default"
      });
    }
  };

  const handleRemoveAvatar = () => {
    // تنظيف URL المؤقت إذا كان موجوداً
    if (customerData.avatar && customerData.avatar.startsWith('blob:')) {
      revokeObjectUrl(customerData.avatar);
    }

    // إعادة تعيين الصورة إلى الصورة الافتراضية
    setCustomerData(prev => ({
      ...prev,
      avatar: '/api/placeholder/100/100',
      avatarFile: undefined
    }));

    toast({
      title: "تم إزالة الصورة",
      description: "تم إعادة تعيين الصورة الافتراضية",
      variant: "default"
    });
  };

  const handleSave = () => {
    if (!customerData.name || !customerData.phone) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى إدخال الاسم ورقم الجوال على الأقل",
        variant: "destructive"
        });
      return;
    }

    // تصفية البيانات الفارغة
    const processedData = {
      ...customerData,
      cars: customerData.cars.filter(car => car.plate || car.make),
      contacts: customerData.contacts.filter(contact => contact.value),
      relatedCustomers: customerData.relatedCustomers.filter(person => person.name || person.phone)
    };

    try {
      let resultCustomer: Customer;

      if (mode === 'edit' && customer) {
        resultCustomer = updateCustomer(customer.id, processedData) as Customer;
        toast({
          title: "تم تحديث بيانات العميل بنجاح",
          description: `تم تحديث بيانات ${customerData.name}`,
          variant: "default"
        });
      } else {
        resultCustomer = addCustomer(processedData);
        toast({
          title: "تم إضافة العميل بنجاح",
          description: `تم إضافة ${customerData.name} كعميل جديد`,
          variant: "default"
        });
      }

      onSuccess?.(resultCustomer);
      onClose();
    } catch (error) {
      toast({
        title: "خطأ في العملية",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 bg-gradient-raghwa text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {mode === 'edit' ? <User className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            </div>
            {mode === 'edit' ? 'تعديل بيانات العميل' : 'إضافة عميل جديد'}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs defaultValue={mode === 'add' ? 'basic' : 'type'} className="w-full">
            {mode === 'edit' && (
              <TabsList className="grid w-full grid-cols-5 mb-6 bg-gradient-to-r from-gray-100 to-blue-50 p-1 rounded-xl">
                <TabsTrigger value="type" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  نوع العميل
                </TabsTrigger>
                <TabsTrigger value="basic" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  البيانات الأساسية
                </TabsTrigger>
                <TabsTrigger value="cars" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                   الكافية
                </TabsTrigger>
                <TabsTrigger value="contacts" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  وسائل الاتصال
                </TabsTrigger>
                <TabsTrigger value="relations" className="data-[state=active]:bg-white data-[state=active]:shadow-md">
                  العلاقات
                </TabsTrigger>
              </TabsList>
            )}

            {/* نوع العميل - يظهر فقط في وضع التعديل */}
            {mode === 'edit' && (
              <TabsContent value="type" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-center text-xl">اختر نوع العميل</CardTitle>
                    <p className="text-center text-gray-600">حدد نوع العميل الذي تريد إضافته</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* عميل فرد */}
                      <div
                        onClick={() => setClientType('individual')}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          clientType === 'individual'
                            ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                            clientType === 'individual' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}>
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">عميل فرد</h3>
                            <p className="text-sm text-gray-600 mt-2">
                              عميل شخصي بمشروب أو أكثر
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            • بيانات شخصية<br/>
                            • معلومات المركبات<br/>
                            • جهات الاتصال
                          </div>
                        </div>
                      </div>

                      {/* شركة */}
                      <div
                        onClick={() => setClientType('company')}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          clientType === 'company'
                            ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                            clientType === 'company' ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            <Building2 className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">شركة</h3>
                            <p className="text-sm text-gray-600 mt-2">
                              شركة مع أسطول مركبات
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            • السجل التجاري<br/>
                            • معلومات الأسطول<br/>
                            • مندوبين الشركة
                          </div>
                        </div>
                      </div>

                      {/* مجموعة */}
                      <div
                        onClick={() => setClientType('group')}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          clientType === 'group'
                            ? 'border-purple-500 bg-purple-50 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="text-center space-y-4">
                          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                            clientType === 'group' ? 'bg-purple-500' : 'bg-gray-400'
                          }`}>
                            <Users className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">مجموعة</h3>
                            <p className="text-sm text-gray-600 mt-2">
                              مجموعة أشخاص أو عائلة
                            </p>
                          </div>
                          <div className="text-xs text-gray-500">
                            • معلومات المجموعة<br/>
                            • أعضاء المجموعة<br/>
                            • المركبات المشتركة
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* البيانات الأساسية */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* صورة العميل */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-gray-700">صورة العميل</Label>
                    <div className="flex items-center gap-6">
                      <SafeImage 
                        src={customerData.avatar} 
                        alt="صورة العميل"
                        size="xl"
                        customerType={customerData.customerType}
                        className="border-4 border-gray-200"
                      />
                      <div className="space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-2"
                          onClick={() => document.getElementById('avatarInput')?.click()}
                      >
                        <Camera className="h-4 w-4" />
                        تغيير الصورة
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => document.getElementById('avatarInput')?.click()}
                      >
                        <Upload className="h-4 w-4" />
                        رفع صورة
                      </Button>
                      <input
                        id="avatarInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                      {customerData.avatar !== 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setShowAvatarPreview(true)}
                          >
                            <Eye className="h-4 w-4" />
                            معاينة
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleRemoveAvatar}
                          >
                            <Trash2 className="h-4 w-4" />
                            إزالة الصورة
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {clientType === 'individual' ? 'الاسم الكامل *' : 
                         clientType === 'company' ? 'اسم الشركة *' : 'اسم المجموعة *'}
                      </Label>
                      <Input
                        id="name"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        placeholder={
                          clientType === 'individual' ? 'أدخل الاسم الكامل' : 
                          clientType === 'company' ? 'أدخل اسم الشركة' : 'أدخل اسم المجموعة'
                        }
                        className="border-2 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        {clientType === 'company' ? 'رقم الشركة *' : 'رقم الجوال *'}
                      </Label>
                      <Input
                        id="phone"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        placeholder="05xxxxxxxx"
                        className="border-2 focus:border-primary"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* حقول إضافية للشركات */}
                  {clientType === 'company' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="commercialReg">رقم السجل التجاري</Label>
                          <Input
                            id="commercialReg"
                            placeholder="1010123456"
                            className="border-2 focus:border-green-500"
                            dir="ltr"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="taxNumber">الرقم الضريبي</Label>
                          <Input
                            id="taxNumber"
                            placeholder="310123456700003"
                            className="border-2 focus:border-green-500"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">الشخص المسؤول</Label>
                          <Input
                            id="contactPerson"
                            placeholder="اسم المسؤول عن الحساب"
                            className="border-2 focus:border-green-500"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="website">الموقع الإلكتروني</Label>
                          <Input
                            id="website"
                            placeholder="www.company.com"
                            className="border-2 focus:border-green-500"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* حقول إضافية للمجموعات */}
                  {clientType === 'group' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="groupType">نوع المجموعة</Label>
                        <Select>
                          <SelectTrigger className="border-2 focus:border-purple-500">
                            <SelectValue placeholder="اختر نوع المجموعة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="family">عائلة</SelectItem>
                            <SelectItem value="friends">مجموعة أصدقاء</SelectItem>
                            <SelectItem value="club">نادي</SelectItem>
                            <SelectItem value="organization">مؤسسة</SelectItem>
                            <SelectItem value="other">أخرى</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="groupSize">عدد الأعضاء المتوقع</Label>
                        <Input
                          id="groupSize"
                          type="number"
                          placeholder="5"
                          className="border-2 focus:border-purple-500"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {clientType === 'company' ? 'البريد الإلكتروني للشركة' : 'البريد الإلكتروني'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                        placeholder="example@email.com"
                        className="border-2 focus:border-green-500"
                        dir="ltr"
                      />
                    </div>
                    
                    {clientType === 'individual' && (
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">تاريخ الميلاد</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={customerData.birthDate}
                          onChange={(e) => setCustomerData({...customerData, birthDate: e.target.value})}
                          className="border-2 focus:border-green-500"
                        />
                      </div>
                    )}

                    {clientType === 'company' && (
                      <div className="space-y-2">
                        <Label htmlFor="establishedDate">تاريخ التأسيس</Label>
                        <Input
                          id="establishedDate"
                          type="date"
                          className="border-2 focus:border-green-500"
                        />
                      </div>
                    )}

                    {clientType === 'group' && (
                      <div className="space-y-2">
                        <Label htmlFor="creationDate">تاريخ إنشاء المجموعة</Label>
                        <Input
                          id="creationDate"
                          type="date"
                          className="border-2 focus:border-purple-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      {clientType === 'company' ? 'عنوان الشركة' : 'العنوان'}
                    </Label>
                    <Textarea
                      id="address"
                      value={customerData.address}
                      onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                      placeholder={
                        clientType === 'company' ? 'عنوان المقر الرئيسي للشركة' : 'أدخل العنوان التفصيلي'
                      }
                      className="border-2 focus:border-green-500"
                      rows={3}
                    />
                  </div>

                  {/* حقل نوع العميل - يظهر في وضع الإضافة */}
                  {mode === 'add' && (
                    <div className="space-y-4">
                      <Label className="text-base font-semibold text-gray-700">نوع العميل</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* عميل فرد */}
                        <div
                          onClick={() => {
                            setClientType('individual');
                            setCustomerData({...customerData, customerType: 'Individual'});
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            clientType === 'individual'
                              ? 'border-blue-500 bg-blue-50 shadow-lg'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                              clientType === 'individual' ? 'bg-blue-500' : 'bg-gray-400'
                            }`}>
                              <User className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">عميل فرد</h4>
                              <p className="text-xs text-gray-600">عميل شخصي</p>
                            </div>
                          </div>
                        </div>

                        {/* شركة */}
                        <div
                          onClick={() => {
                            setClientType('company');
                            setCustomerData({...customerData, customerType: 'Company'});
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            clientType === 'company'
                              ? 'border-green-500 bg-green-50 shadow-lg'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                              clientType === 'company' ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">شركة</h4>
                              <p className="text-xs text-gray-600">مؤسسة تجارية</p>
                            </div>
                          </div>
                        </div>

                        {/* مجموعة */}
                        <div
                          onClick={() => {
                            setClientType('group');
                            setCustomerData({...customerData, customerType: 'Group'});
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                            clientType === 'group'
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-center space-y-3">
                            <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                              clientType === 'group' ? 'bg-purple-500' : 'bg-gray-400'
                            }`}>
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">مجموعة</h4>
                              <p className="text-xs text-gray-600">مجموعة أشخاص</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>نوع العضوية</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {customerTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.value}
                            onClick={() => setCustomerData({...customerData, customerType: type.value as any})}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              customerData.customerType === type.value
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-full ${type.color} text-white`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="font-medium">{type.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات</Label>
                    <Textarea
                      id="notes"
                      value={customerData.notes}
                      onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                      placeholder="أي ملاحظات خاصة بالعميل..."
                      className="border-2 focus:border-green-500"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/*  الكافية - يظهر فقط في وضع التعديل */}
            {mode === 'edit' && (
              <TabsContent value="cars" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">سيارات العميل</h3>
                  <p className="text-gray-600 text-sm">إدارة سيارات العميل</p>
                </div>
                <Button onClick={addCar} size="sm" className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                  <Plus className="h-4 w-4" />
                  إضافة مشروب
                </Button>
              </div>

              <div className="space-y-4">
                {customerData.cars.map((car, index) => (
                  <Card key={car.id} className="border border-gray-200 hover:border-green-300 transition-all duration-200">
                    <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-green-100 rounded-lg">
                            <Car className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <CardTitle className="text-base text-gray-900">المشروب {index + 1}</CardTitle>
                            <p className="text-xs text-gray-600">
                              {car.make && car.model ? `${car.make} ${car.model}` : 'لم يتم تحديد الماركة والموديل'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {car.plate && (
                            <div className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-mono">
                              {car.plate}
                            </div>
                          )}
                          {customerData.cars.length > 1 && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeCar(car.id)}
                              className="h-7 w-7 p-0 hover:bg-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-4 space-y-4">
                      {/* المعلومات الأساسية - صف واحد */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">رقم اللوحة</Label>
                          <Input
                            value={car.plate}
                            onChange={(e) => updateCar(car.id, 'plate', e.target.value.toUpperCase())}
                            placeholder="أبج1234"
                            className="border h-8 text-xs text-center font-mono"
                            maxLength={8}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">الماركة</Label>
                          <Select value={car.make} onValueChange={(value) => updateCar(car.id, 'make', value)}>
                            <SelectTrigger className="border h-8 text-xs">
                              <SelectValue placeholder="الماركة" />
                            </SelectTrigger>
                            <SelectContent>
                              {carMakes.map((make) => (
                                <SelectItem key={make} value={make}>{make}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">الموديل</Label>
                          <Input
                            value={car.model}
                            onChange={(e) => updateCar(car.id, 'model', e.target.value)}
                            placeholder="كامري"
                            className="border h-8 text-xs"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">سنة الصنع</Label>
                          <Input
                            value={car.year}
                            onChange={(e) => updateCar(car.id, 'year', e.target.value)}
                            placeholder="2020"
                            type="number"
                            min="1990"
                            max="2025"
                            className="border h-8 text-xs"
                          />
                        </div>
                      </div>

                      {/* عرض بصري للوحة */}
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-gray-700">معاينة اللوحة</Label>
                        <div className="flex justify-center">
                          <div className="relative transform hover:scale-105 transition-transform duration-300">
                            {/* لوحة مصرية محسنة - تصميم 2024 */}
                            <div className="w-72 h-36 bg-gradient-to-br from-white via-gray-50 to-white border-[3px] border-gray-800 shadow-2xl relative overflow-hidden rounded-sm">
                              {/* تأثيرات بصرية متقدمة */}
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-50/30 to-transparent"></div>
                              
                              {/* الشريط الأيمن - شعار المصرية */}
                              <div className="absolute right-0 top-0 w-10 h-full bg-gradient-to-b from-green-600 to-green-700 border-l-2 border-gray-800 flex flex-col items-center justify-between py-3">
                                {/* شعار المصرية */}
                                <div className="w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                                  <span className="text-white text-sm font-bold">🌴</span>
                                </div>
                                
                                {/* كلمة المصرية */}
                                <div className="text-center">
                                  <div className="text-xs font-bold text-white writing-mode-vertical tracking-wider">المصرية</div>
                                </div>
                                
                                {/* رمز KSA */}
                                <div className="text-center">
                                  <div className="text-xs font-bold text-white writing-mode-vertical tracking-wider">KSA</div>
                                </div>
                                
                                {/* منطقة الأمان */}
                                <div className="w-5 h-4 bg-gradient-to-r from-gray-300 to-gray-400 border border-gray-500 rounded-sm shadow-inner"></div>
                                
                                {/* النقطة السوداء */}
                                <div className="w-2.5 h-2.5 bg-black rounded-full shadow-lg"></div>
                              </div>
                              
                              {/* المنطقة الرئيسية - 4 أقسام */}
                              <div className="absolute left-0 top-0 right-10 h-full">
                                {/* الصف العلوي */}
                                <div className="h-1/2 flex">
                                  {/* القسم العلوي الأيسر - أرقام عربية */}
                                  <div className="w-1/2 border-r-2 border-b-2 border-gray-800 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white relative">
                                    <div className="text-3xl font-black text-gray-900 font-mono tracking-wider">
                                      {car.plate ? car.plate.replace(/[^0-9]/g, '').slice(0, 6) || '٨٧٨٥٤٣' : '٨٧٨٥٤٣'}
                                    </div>
                                    {/* تأثير ثلاثي الأبعاد */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                  </div>
                                  
                                  {/* القسم العلوي الأيمن - حروف عربية */}
                                  <div className="w-1/2 border-b-2 border-gray-800 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white relative">
                                    <div className="text-3xl font-black text-gray-900 font-mono tracking-wider">
                                      {car.plate ? car.plate.replace(/[^أ-ي]/g, '').slice(0, 4) || 'ه ب ج د' : 'ه ب ج د'}
                                    </div>
                                    {/* تأثير ثلاثي الأبعاد */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                  </div>
                                </div>
                                
                                {/* الصف السفلي */}
                                <div className="h-1/2 flex">
                                  {/* القسم السفلي الأيسر - أرقام لاتينية */}
                                  <div className="w-1/2 border-r-2 border-gray-800 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white relative">
                                    <div className="text-3xl font-black text-gray-900 font-mono tracking-wider">
                                      {car.plate ? car.plate.replace(/[^0-9]/g, '').slice(0, 6) || '878543' : '878543'}
                                    </div>
                                    {/* تأثير ثلاثي الأبعاد */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                  </div>
                                  
                                  {/* القسم السفلي الأيمن - حروف لاتينية */}
                                  <div className="w-1/2 border-gray-800 flex items-center justify-center bg-gradient-to-br from-gray-100 to-white relative">
                                    <div className="text-3xl font-black text-gray-900 font-mono tracking-wider">
                                      {car.plate ? convertArabicToEnglish(car.plate.replace(/[^أ-ي]/g, '')).slice(0, 4) || 'HBCD' : 'HBCD'}
                                    </div>
                                    {/* تأثير ثلاثي الأبعاد */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent pointer-events-none"></div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* المسامير المحسنة */}
                              <div className="absolute top-2 left-1/4 w-4 h-4 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full border-2 border-gray-700 shadow-lg">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-auto mt-0.5"></div>
                              </div>
                              <div className="absolute top-2 left-3/4 w-4 h-4 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full border-2 border-gray-700 shadow-lg">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mx-auto mt-0.5"></div>
                              </div>
                              
                              {/* علامة مائية محسنة */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-7xl text-red-500/15 font-black">س</div>
                              </div>
                              
                              {/* تأثيرات إضافية */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
                            </div>
                            
                            {/* ظل خلف اللوحة */}
                            <div className="absolute -bottom-3 left-3 right-3 h-3 bg-black/30 rounded-full blur-md"></div>
                            
                            {/* تأثير الإضاءة */}
                            <div className="absolute -top-2 -left-2 w-4 h-4 bg-white/60 rounded-full blur-sm"></div>
                          </div>
                        </div>
                        
                       
                      </div>

                      {/* اللون ونوع الوقود وناقل الحركة */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-700">المواصفات</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">اللون</Label>
                            <Select value={car.color} onValueChange={(value) => updateCar(car.id, 'color', value)}>
                              <SelectTrigger className="border-2 focus:border-green-500 h-10">
                                <SelectValue placeholder="اللون" />
                              </SelectTrigger>
                              <SelectContent>
                                {carColors.map((color) => (
                                  <SelectItem key={color} value={color}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full border border-gray-300 ${getColorClass(color)}`}></div>
                                      {color}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">نوع الوقود</Label>
                            <Select value={car.fuelType} onValueChange={(value) => updateCar(car.id, 'fuelType', value)}>
                              <SelectTrigger className="border-2 focus:border-green-500 h-10">
                                <SelectValue placeholder="الوقود" />
                              </SelectTrigger>
                              <SelectContent>
                                {fuelTypes.map((fuel) => (
                                  <SelectItem key={fuel} value={fuel}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${getFuelIconColor(fuel)}`}></div>
                                      {fuel}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-sm">ناقل الحركة</Label>
                            <Select value={car.transmission} onValueChange={(value) => updateCar(car.id, 'transmission', value)}>
                              <SelectTrigger className="border-2 focus:border-green-500 h-10">
                                <SelectValue placeholder="الناقل" />
                              </SelectTrigger>
                              <SelectContent>
                                {transmissionTypes.map((trans) => (
                                  <SelectItem key={trans} value={trans}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${getTransmissionIconColor(trans)}`}></div>
                                      {trans}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* نوع الوقود وناقل الحركة */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label>نوع الوقود</Label>
                          <Select value={car.fuelType} onValueChange={(value) => updateCar(car.id, 'fuelType', value)}>
                            <SelectTrigger className="border-2 focus:border-green-500 h-12">
                              <SelectValue placeholder="اختر نوع الوقود" />
                            </SelectTrigger>
                            <SelectContent>
                              {fuelTypes.map((fuel) => (
                                <SelectItem key={fuel} value={fuel}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getFuelIconColor(fuel)}`}></div>
                                    {fuel}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-3">
                          <Label>ناقل الحركة</Label>
                          <Select value={car.transmission} onValueChange={(value) => updateCar(car.id, 'transmission', value)}>
                            <SelectTrigger className="border-2 focus:border-green-500 h-12">
                              <SelectValue placeholder="اختر ناقل الحركة" />
                            </SelectTrigger>
                            <SelectContent>
                              {transmissionTypes.map((trans) => (
                                <SelectItem key={trans} value={trans}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${getTransmissionIconColor(trans)}`}></div>
                                    {trans}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* المواصفات التقنية */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-700">المواصفات التقنية</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">نوع المركبة</Label>
                            <Select value={car.vehicleType || ''} onValueChange={(value) => updateCar(car.id, 'vehicleType', value)}>
                              <SelectTrigger className="border-2 focus:border-blue-500 h-10">
                                <SelectValue placeholder="النوع" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sedan">🚗 سيدان</SelectItem>
                                <SelectItem value="suv">🚙 دفع رباعي</SelectItem>
                                <SelectItem value="hatchback">🚐 هاتشباك</SelectItem>
                                <SelectItem value="coupe">🏎️ كوبيه</SelectItem>
                                <SelectItem value="pickup">🛻 بيك آب</SelectItem>
                                <SelectItem value="van">🚐 فان</SelectItem>
                                <SelectItem value="wagon">🚐 واجن</SelectItem>
                                <SelectItem value="convertible">🚗 مكشوفة</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">سعة المحرك</Label>
                            <Select value={car.engineSize || ''} onValueChange={(value) => updateCar(car.id, 'engineSize', value)}>
                              <SelectTrigger className="border-2 focus:border-blue-500 h-10">
                                <SelectValue placeholder="السعة" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1.0">⚡ 1.0 لتر</SelectItem>
                                <SelectItem value="1.2">⚡ 1.2 لتر</SelectItem>
                                <SelectItem value="1.4">⚡ 1.4 لتر</SelectItem>
                                <SelectItem value="1.6">⚡ 1.6 لتر</SelectItem>
                                <SelectItem value="1.8">⚡ 1.8 لتر</SelectItem>
                                <SelectItem value="2.0">⚡ 2.0 لتر</SelectItem>
                                <SelectItem value="2.4">⚡ 2.4 لتر</SelectItem>
                                <SelectItem value="2.5">⚡ 2.5 لتر</SelectItem>
                                <SelectItem value="3.0">⚡ 3.0 لتر</SelectItem>
                                <SelectItem value="3.5">⚡ 3.5 لتر</SelectItem>
                                <SelectItem value="4.0">⚡ 4.0 لتر</SelectItem>
                                <SelectItem value="5.0">⚡ 5.0 لتر</SelectItem>
                                <SelectItem value="6.0">⚡ 6.0 لتر</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* المعلومات الإضافية */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-700">معلومات إضافية</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm">رقم الهيكل</Label>
                            <Input
                              value={car.chassisNumber || ''}
                              onChange={(e) => updateCar(car.id, 'chassisNumber', e.target.value.toUpperCase())}
                              placeholder="17 رقم وحرف"
                              maxLength={17}
                              className="border-2 focus:border-purple-500 font-mono h-10 text-center text-xs"
                            />
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500">الطول</span>
                              <span className={`font-mono ${(car.chassisNumber || '').length === 17 ? 'text-green-600' : 'text-gray-400'}`}>
                                {(car.chassisNumber || '').length}/17
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">عداد المسافة</Label>
                            <Input
                              value={car.odometerReading || ''}
                              onChange={(e) => updateCar(car.id, 'odometerReading', e.target.value)}
                              placeholder="100000"
                              type="number"
                              min="0"
                              className="border-2 focus:border-purple-500 h-10"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm">كمية الزيت</Label>
                            <Input
                              value={car.recommendedOilQuantity || ''}
                              onChange={(e) => updateCar(car.id, 'recommendedOilQuantity', e.target.value)}
                              placeholder="4.5"
                              type="number"
                              step="0.1"
                              min="0"
                              className="border-2 focus:border-purple-500 h-10"
                            />
                          </div>
                        </div>
                      </div>

                      {/* ملاحظات المشروب */}
                      <div className="space-y-4">
                        <Label className="text-base font-semibold text-gray-700">ملاحظات المشروب</Label>
                        <div className="space-y-2">
                          <Textarea
                            value={car.notes}
                            onChange={(e) => updateCar(car.id, 'notes', e.target.value)}
                            placeholder="ملاحظات خاصة بالمشروب..."
                            className="border-2 focus:border-orange-500 min-h-[80px] resize-none"
                            rows={3}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </TabsContent>
            )}

            {/* وسائل الاتصال - يظهر فقط في وضع التعديل */}
            {mode === 'edit' && (
              <TabsContent value="contacts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">وسائل الاتصال</h3>
                <Button onClick={addContact} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة وسيلة اتصال
                </Button>
              </div>

              <div className="space-y-3">
                {customerData.contacts.map((contact, index) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>نوع الاتصال</Label>
                            <Select value={contact.type} onValueChange={(value) => updateContact(contact.id, 'type', value)}>
                              <SelectTrigger className="border-2 focus:border-green-500">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {contactTypes.map((type) => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>القيمة</Label>
                            <Input
                              value={contact.value}
                              onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                              placeholder="أدخل رقم الجوال أو الهاتف"
                              className="border-2 focus:border-green-500"
                              dir="ltr"
                            />
                          </div>
                        </div>
                        {customerData.contacts.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </TabsContent>
            )}

            {/* العلاقات - يظهر فقط في وضع التعديل */}
            {mode === 'edit' && (
              <TabsContent value="relations" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">الأقارب والأصدقاء</h3>
                <Button onClick={addRelatedPerson} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة شخص
                </Button>
              </div>

              <div className="space-y-3">
                {customerData.relatedCustomers.map((person, index) => (
                  <Card key={person.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>الاسم</Label>
                            <Input
                              value={person.name}
                              onChange={(e) => updateRelatedPerson(person.id, 'name', e.target.value)}
                              placeholder="أدخل الاسم"
                              className="border-2 focus:border-green-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>رقم الجوال</Label>
                            <Input
                              value={person.phone}
                              onChange={(e) => updateRelatedPerson(person.id, 'phone', e.target.value)}
                              placeholder="05xxxxxxxx"
                              className="border-2 focus:border-green-500"
                              dir="ltr"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>صلة القرابة</Label>
                            <Select value={person.relation} onValueChange={(value) => updateRelatedPerson(person.id, 'relation', value)}>
                              <SelectTrigger className="border-2 focus:border-green-500">
                                <SelectValue placeholder="اختر صلة القرابة" />
                              </SelectTrigger>
                              <SelectContent>
                                {relationTypes.map((relation) => (
                                  <SelectItem key={relation} value={relation}>{relation}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRelatedPerson(person.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50">
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-gradient-raghwa">
              <Save className="h-4 w-4 mr-2" />
              {mode === 'edit' ? 'حفظ التغييرات' : 'إضافة العميل'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {/* نافذة معاينة الصورة */}
      <Dialog open={showAvatarPreview} onOpenChange={setShowAvatarPreview}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">معاينة صورة العميل</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <SafeImage 
              src={customerData.avatar} 
              alt="صورة العميل"
              size="custom"
              customerType={customerData.customerType}
              className="w-64 h-64 rounded-lg border-4 border-gray-200"
            />
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                {customerData.avatarFile ? (
                  <>
                    <strong>اسم الملف:</strong> {customerData.avatarFile.name}<br/>
                    <strong>الحجم:</strong> {(customerData.avatarFile.size / 1024 / 1024).toFixed(2)} ميجابايت<br/>
                    <strong>النوع:</strong> {customerData.avatarFile.type}
                  </>
                ) : (
                  'صورة افتراضية'
                )}
              </p>
            </div>
            <Button 
              onClick={() => setShowAvatarPreview(false)}
              className="w-full"
            >
              إغلاق
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}