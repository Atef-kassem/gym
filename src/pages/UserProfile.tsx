import { useState } from 'react';
import { User, Camera, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'أحمد محمد',
    email: 'ahmed@raghwa.com',
    phone: '+966 50 123 4567',
    position: 'مدير النظام',
    department: 'إدارة التقنية',
    address: 'الرياض، المملكة العربية المصرية',
    joinDate: '2023-01-15',
    bio: 'مدير نظام خبير في إدارة أنظمة المغاسل وتطوير العمليات التشغيلية',
    avatar: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    // حفظ البيانات في قاعدة البيانات
  };

  const handleCancel = () => {
    setIsEditing(false);
    // إعادة تحميل البيانات الأصلية
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">الملف الشخصي</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="w-4 h-4" />
            تحرير الملف
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              حفظ التغييرات
            </Button>
            <Button onClick={handleCancel} variant="outline" className="gap-2">
              <X className="w-4 h-4" />
              إلغاء
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* صورة الملف الشخصي */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-center">الصورة الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profileData.avatar} alt={profileData.name} />
                <AvatarFallback className="text-2xl bg-primary text-white">
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary-hover transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground">{profileData.name}</h3>
              <p className="text-muted-foreground">{profileData.position}</p>
              <p className="text-sm text-muted-foreground">{profileData.department}</p>
            </div>
          </CardContent>
        </Card>

        {/* معلومات شخصية */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>المعلومات الشخصية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">رقم الهاتف</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">المنصب</Label>
                {isEditing ? (
                  <Input
                    id="position"
                    value={profileData.position}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.position}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">القسم</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{profileData.department}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">تاريخ الانضمام</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(profileData.joinDate).toLocaleDateString('ar-SA')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{profileData.address}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">نبذة شخصية</Label>
              {isEditing ? (
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  <span>{profileData.bio}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* إحصائيات المستخدم */}
      <Card>
        <CardHeader>
          <CardTitle>إحصائيات النشاط</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">124</div>
              <div className="text-sm text-blue-600">العمليات المنجزة</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">45</div>
              <div className="text-sm text-green-600">أيام النشاط</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-orange-600">التقارير المنشأة</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-purple-600">معدل الأداء</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;