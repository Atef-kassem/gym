import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Gift, 
  Star, 
  Crown, 
  Trophy,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

interface CustomerLoyaltyCardProps {
  customer: any;
}

export function CustomerLoyaltyCard({ customer }: CustomerLoyaltyCardProps) {
  const loyaltyTiers = [
    { name: 'برونزي', points: 0, color: 'from-amber-600 to-yellow-700', icon: Award },
    { name: 'فضي', points: 500, color: 'from-gray-400 to-gray-600', icon: Star },
    { name: 'ذهبي', points: 1000, color: 'from-yellow-400 to-yellow-600', icon: Trophy },
    { name: 'بلاتيني', points: 2000, color: 'from-purple-400 to-purple-600', icon: Crown }
  ];

  const getCurrentTier = (points: number) => {
    for (let i = loyaltyTiers.length - 1; i >= 0; i--) {
      if (points >= loyaltyTiers[i].points) {
        return { ...loyaltyTiers[i], index: i };
      }
    }
    return { ...loyaltyTiers[0], index: 0 };
  };

  const getNextTier = (currentTierIndex: number) => {
    return currentTierIndex < loyaltyTiers.length - 1 
      ? loyaltyTiers[currentTierIndex + 1] 
      : null;
  };

  const currentTier = getCurrentTier(customer.loyaltyPoints || 0);
  const nextTier = getNextTier(currentTier.index);
  const CurrentTierIcon = currentTier.icon;

  const pointsToNextTier = nextTier ? nextTier.points - customer.loyaltyPoints : 0;
  const progressToNextTier = nextTier 
    ? ((customer.loyaltyPoints - currentTier.points) / (nextTier.points - currentTier.points)) * 100
    : 100;

  // محاولة قراءة الكوبونات والباقات
  const activeCoupons = customer.coupons?.filter(coupon => coupon.status === 'نشط') || [];
  const activePackages = customer.packages?.filter(pkg => pkg.status === 'نشط') || [];

  return (
    <div className="space-y-4">
      {/* بطاقة المستوى الحالي */}
      <Card className={`bg-gradient-to-r ${currentTier.color} text-white overflow-hidden relative`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <CurrentTierIcon className="w-full h-full" />
        </div>
        <CardHeader className="relative z-10">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrentTierIcon className="h-6 w-6" />
              <span>مستوى {currentTier.name}</span>
            </div>
            <Badge className="bg-white/20 text-white border-white/30">
              {customer.loyaltyPoints || 0} نقطة
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>التقدم نحو المستوى التالي</span>
              {nextTier && (
                <span>{pointsToNextTier} نقطة متبقية</span>
              )}
            </div>
            {nextTier ? (
              <Progress 
                value={progressToNextTier} 
                className="h-2 bg-white/20" 
              />
            ) : (
              <div className="text-center py-2">
                <Trophy className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">وصلت للمستوى الأعلى!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* الكوبونات النشطة */}
      {activeCoupons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Gift className="h-5 w-5" />
              الكوبونات المتاحة ({activeCoupons.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCoupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <div className="font-semibold text-green-800">{coupon.code}</div>
                  <div className="text-sm text-green-600">{coupon.description}</div>
                  <div className="text-xs text-green-500">
                    صالح حتى: {new Date(coupon.validUntil).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 text-lg font-bold">
                  {coupon.discount}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* الباقات النشطة */}
      {activePackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Star className="h-5 w-5" />
              الباقات النشطة ({activePackages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activePackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <div className="font-semibold text-blue-800">{pkg.name}</div>
                  <div className="text-sm text-blue-600">
                    متبقي: {pkg.remaining} من {pkg.total} خدمة
                  </div>
                  <div className="text-xs text-blue-500">
                    صالحة حتى: {new Date(pkg.validUntil).toLocaleDateString('ar-SA')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-800">{pkg.remaining}</div>
                  <div className="text-xs text-blue-600">خدمة متبقية</div>
                  <Progress 
                    value={(pkg.remaining / pkg.total) * 100} 
                    className="w-16 h-2 mt-1"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* مزايا المستوى */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <TrendingUp className="h-5 w-5" />
            مزايا مستوى {currentTier.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {currentTier.name === 'برونزي' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>نقطة واحدة لكل 10 جنيه</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>خصم 5% في عيد الميلاد</span>
                </div>
              </>
            )}
            
            {currentTier.name === 'فضي' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>نقطة واحدة لكل 8 جنيه</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>خصم 10% في عيد الميلاد</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>  مجاني شهرياً</span>
                </div>
              </>
            )}
            
            {currentTier.name === 'ذهبي' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>نقطة واحدة لكل 5 جنيه</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>خصم 15% في عيد الميلاد</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span> ان مجانيان شهرياً</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>أولوية في الحجز</span>
                </div>
              </>
            )}
            
            {currentTier.name === 'بلاتيني' && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>نقطة واحدة لكل 3 جنيه</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>خصم 20% في عيد الميلاد</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>  مجاني أسبوعياً</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>أولوية قصوى في الحجز</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>خدمة توصيل مجانية</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* إحصائيات الولاء */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-5 w-5" />
            إحصائيات الولاء
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">{customer.totalVisits || 0}</div>
              <div className="text-xs text-gray-600">إجمالي الزيارات</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {Math.floor((customer.totalSpent || 0) / (customer.totalVisits || 1))}
              </div>
              <div className="text-xs text-gray-600">متوسط الإنفاق</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {Math.floor((Date.now() - new Date(customer.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-xs text-gray-600">يوماً معنا</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {customer.cars?.length || 0}
              </div>
              <div className="text-xs text-gray-600"> الكافية المسجلة</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}