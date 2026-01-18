import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Car,
  Plus,
  Trash2,
  Crown,
  Star,
  Shield,
  Camera,
  Upload
} from 'lucide-react';

interface CustomerEditDialogProps {
  customer: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: any) => void;
}

export function CustomerEditDialog({ customer, isOpen, onClose, onSave }: CustomerEditDialogProps) {
  const { toast } = useToast();
  
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    customerType: 'Individual',
    notes: '',
    avatar: ''
  });

  const [cars, setCars] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [relatedPeople, setRelatedPeople] = useState([]);

  useEffect(() => {
    if (customer) {
      setCustomerData({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        birthDate: customer.birthDate || '',
        customerType: customer.customerType || 'Individual',
        notes: customer.notes || '',
        avatar: customer.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
      });
      setCars(customer.cars || []);
      setContacts(customer.contacts || [{ id: 1, type: 'جوال', value: customer.phone || '' }]);
      setRelatedPeople(customer.relatedCustomers || []);
    }
  }, [customer]);

  const customerTypes = [
    { value: 'Individual', label: 'عميل فردي', icon: User, color: 'bg-blue-500' },
    { value: 'Company', label: 'شركة', icon: Shield, color: 'bg-green-500' },
    { value: 'Group', label: 'مجموعة', icon: Crown, color: 'bg-purple-500' }
  ];

  const contactTypes = ['جوال', 'هاتف منزل', 'هاتف عمل', 'واتساب', 'تلغرام'];
  const relationTypes = ['أب', 'أم', 'أخ', 'أخت', 'زوج', 'زوجة', 'ابن', 'ابنة', 'صديق', 'قريب', 'زميل'];

  const addCar = () => {
    setCars([...cars, {
      id: Date.now(),
      plate: '',
      make: '',
      model: '',
      year: '',
      color: '',
      fuelType: '',
      transmission: '',
      notes: ''
    }]);
  };

  const removeCar = (id: number) => {
    setCars(cars.filter(car => car.id !== id));
  };

  const updateCar = (id: number, field: string, value: string) => {
    setCars(cars.map(car => 
      car.id === id ? { ...car, [field]: value } : car
    ));
  };

  const addContact = () => {
    setContacts([...contacts, {
      id: Date.now(),
      type: 'جوال',
      value: ''
    }]);
  };

  const removeContact = (id: number) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(contact => contact.id !== id));
    }
  };

  const updateContact = (id: number, field: string, value: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    ));
  };

  const addRelatedPerson = () => {
    setRelatedPeople([...relatedPeople, {
      id: Date.now(),
      name: '',
      phone: '',
      relation: ''
    }]);
  };

  const removeRelatedPerson = (id: number) => {
    setRelatedPeople(relatedPeople.filter(person => person.id !== id));
  };

  const updateRelatedPerson = (id: number, field: string, value: string) => {
    setRelatedPeople(relatedPeople.map(person => 
      person.id === id ? { ...person, [field]: value } : person
    ));
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

    const updatedCustomerData = {
      ...customer,
      ...customerData,
      cars: cars.filter(car => car.plate || car.make),
      contacts: contacts.filter(contact => contact.value),
      relatedCustomers: relatedPeople.filter(person => person.name || person.phone),
    };

    onSave(updatedCustomerData);
    
    toast({
      title: "تم تحديث بيانات العميل بنجاح",
      description: `تم تحديث بيانات ${customerData.name}`,
      variant: "default"
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <User className="h-6 w-6" />
            </div>
            تعديل بيانات العميل
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-gray-100 to-blue-50 p-1 rounded-xl">
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

            {/* ... باقي المحتوى مشابه لـ AddCustomerPopup ولكن مع البيانات المحملة مسبقاً ... */}
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    المعلومات الشخصية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* صورة العميل */}
                  <div className="flex items-center gap-4">
                    <img 
                      src={customerData.avatar} 
                      alt="صورة العميل"
                      className="w-20 h-20 rounded-full border-4 border-gray-200 object-cover"
                    />
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Camera className="h-4 w-4" />
                        تغيير الصورة
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        رفع صورة
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">الاسم الكامل *</Label>
                      <Input
                        id="name"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        placeholder="أدخل الاسم الكامل"
                        className="border-2 focus:border-primary"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الجوال *</Label>
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">البريد الإلكتروني</Label>
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">العنوان</Label>
                    <Textarea
                      id="address"
                      value={customerData.address}
                      onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                      placeholder="أدخل العنوان التفصيلي"
                      className="border-2 focus:border-green-500"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>نوع العضوية</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {customerTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <div
                            key={type.value}
                            onClick={() => setCustomerData({...customerData, customerType: type.value})}
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

            {/* باقي التبويبات... */}
          </Tabs>
        </div>

        <DialogFooter className="p-6 border-t bg-gray-50">
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={onClose} className="flex-1">
              <X className="h-4 w-4 mr-2" />
              إلغاء
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
              <Save className="h-4 w-4 mr-2" />
              حفظ التغييرات
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}