import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  CheckCircle,
  Star,
  Crown,
  Shield,
  Upload,
  Camera
} from 'lucide-react';

interface AddCustomerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: any) => void;
}

export function AddCustomerPopup({ isOpen, onClose, onSave }: AddCustomerPopupProps) {
  const { toast } = useToast();
  
  // بيانات العميل الأساسية
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    birthDate: '',
    customerType: 'Individual',
    notes: '',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  });

  //  الكافية
  const [cars, setCars] = useState([
    {
      id: 1,
      plate: '',
      make: '',
      model: '',
      year: '',
      color: '',
      notes: ''
    }
  ]);

  // معلومات الاتصال الإضافية
  const [contacts, setContacts] = useState([
    { id: 1, type: 'جوال', value: '' }
  ]);

  // الأقارب والأصدقاء
  const [relatedPeople, setRelatedPeople] = useState([
    { id: 1, name: '', phone: '', relation: '' }
  ]);

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

  const relationTypes = [
    'أب', 'أم', 'أخ', 'أخت', 'زوج', 'زوجة', 'ابن', 'ابنة', 'صديق', 'قريب', 'زميل'
  ];

  const contactTypes = [
    'جوال', 'هاتف منزل', 'هاتف عمل', 'واتساب', 'تلغرام'
  ];

  const addCar = () => {
    setCars([...cars, {
      id: Date.now(),
      plate: '',
      make: '',
      model: '',
      year: '',
      color: '',
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

    const completeCustomerData = {
      ...customerData,
      cars: cars.filter(car => car.plate || car.make),
      contacts: contacts.filter(contact => contact.value),
      relatedCustomers: relatedPeople.filter(person => person.name || person.phone),
      joinDate: new Date().toISOString(),
      totalVisits: 0,
      totalSpent: 0,
      coupons: [],
      packages: []
    };

    onSave(completeCustomerData);
    
    toast({
      title: "تم إضافة العميل بنجاح",
      description: `تم إضافة ${customerData.name} كعميل جديد`,
      variant: "default"
    });
  };

  const getCustomerTypeIcon = (type: string) => {
    const typeData = customerTypes.find(t => t.value === type);
    if (!typeData) return null;
    const Icon = typeData.icon;
    return <Icon className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 bg-gradient-raghwa text-white rounded-t-lg">
          <DialogTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <UserPlus className="h-6 w-6" />
            </div>
            إضافة عميل جديد
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

            <TabsContent value="cars" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">سيارات العميل</h3>
                <Button onClick={addCar} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة مشروب
                </Button>
              </div>

              <div className="space-y-4">
                {cars.map((car, index) => (
                  <Card key={car.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Car className="h-4 w-4" />
                          المشروب {index + 1}
                        </CardTitle>
                        {cars.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeCar(car.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>رقم اللوحة</Label>
                          <Input
                            value={car.plate}
                            onChange={(e) => updateCar(car.id, 'plate', e.target.value)}
                            placeholder="أبج1234"
                            className="border-2 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>الماركة</Label>
                          <Select value={car.make} onValueChange={(value) => updateCar(car.id, 'make', value)}>
                            <SelectTrigger className="border-2 focus:border-green-500">
                              <SelectValue placeholder="اختر الماركة" />
                            </SelectTrigger>
                            <SelectContent>
                              {carMakes.map((make) => (
                                <SelectItem key={make} value={make}>{make}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>الموديل</Label>
                          <Input
                            value={car.model}
                            onChange={(e) => updateCar(car.id, 'model', e.target.value)}
                            placeholder="كامري"
                            className="border-2 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>السنة</Label>
                          <Input
                            value={car.year}
                            onChange={(e) => updateCar(car.id, 'year', e.target.value)}
                            placeholder="2020"
                            type="number"
                            min="1990"
                            max="2025"
                            className="border-2 focus:border-green-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>اللون</Label>
                          <Select value={car.color} onValueChange={(value) => updateCar(car.id, 'color', value)}>
                            <SelectTrigger className="border-2 focus:border-green-500">
                              <SelectValue placeholder="اختر اللون" />
                            </SelectTrigger>
                            <SelectContent>
                              {carColors.map((color) => (
                                <SelectItem key={color} value={color}>{color}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>ملاحظات المشروب</Label>
                        <Textarea
                          value={car.notes}
                          onChange={(e) => updateCar(car.id, 'notes', e.target.value)}
                          placeholder="أي ملاحظات خاصة بهذه المشروب..."
                          className="border-2 focus:border-green-500"
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">وسائل الاتصال</h3>
                <Button onClick={addContact} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة وسيلة اتصال
                </Button>
              </div>

              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 grid grid-cols-2 gap-4">
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
                          <Input
                            value={contact.value}
                            onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                            placeholder="أدخل رقم أو معرف الاتصال"
                            className="border-2 focus:border-green-500"
                            dir="ltr"
                          />
                        </div>
                        {contacts.length > 1 && (
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

            <TabsContent value="relations" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">الأقارب والأصدقاء</h3>
                <Button onClick={addRelatedPerson} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة شخص
                </Button>
              </div>

              <div className="space-y-3">
                {relatedPeople.map((person, index) => (
                  <Card key={person.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <Input
                            value={person.name}
                            onChange={(e) => updateRelatedPerson(person.id, 'name', e.target.value)}
                            placeholder="الاسم"
                            className="border-2 focus:border-green-500"
                          />
                          <Input
                            value={person.phone}
                            onChange={(e) => updateRelatedPerson(person.id, 'phone', e.target.value)}
                            placeholder="رقم الجوال"
                            className="border-2 focus:border-green-500"
                            dir="ltr"
                          />
                          <Select value={person.relation} onValueChange={(value) => updateRelatedPerson(person.id, 'relation', value)}>
                            <SelectTrigger className="border-2 focus:border-green-500">
                              <SelectValue placeholder="صلة القرابة" />
                            </SelectTrigger>
                            <SelectContent>
                              {relationTypes.map((relation) => (
                                <SelectItem key={relation} value={relation}>{relation}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
          </Tabs>
        </div>

        <div className="p-6 pt-0 bg-gray-50">
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 bg-gradient-raghwa hover:opacity-90 text-white">
              <Save className="h-4 w-4 mr-2" />
              حفظ العميل
            </Button>
            <Button variant="outline" onClick={onClose} className="px-8">
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}