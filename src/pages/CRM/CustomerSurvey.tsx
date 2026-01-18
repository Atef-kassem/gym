import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Star, Send, ChevronLeft, ChevronRight } from "lucide-react";

interface FeedbackData {
  customerName: string;
  phoneNumber: string;
  serviceDate: string;
  overallSatisfaction: string;
  serviceQuality: string;
  staffBehavior: string;
  cleaningQuality: string;
  waitingTime: string;
  valueForMoney: string;
  wouldRecommend: string;
  additionalServices: string[];
  suggestions: string;
  visitFrequency: string;
}

export default function CustomerSurvey() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FeedbackData>({
    customerName: '',
    phoneNumber: '',
    serviceDate: '',
    overallSatisfaction: '',
    serviceQuality: '',
    staffBehavior: '',
    cleaningQuality: '',
    waitingTime: '',
    valueForMoney: '',
    wouldRecommend: '',
    additionalServices: [],
    suggestions: '',
    visitFrequency: ''
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Here you would normally send the data to your backend
    console.log('Survey Data:', formData);
    toast.success('شكراً لك! تم إرسال الاستبيان بنجاح');
    
    // Reset form
    setFormData({
      customerName: '',
      phoneNumber: '',
      serviceDate: '',
      overallSatisfaction: '',
      serviceQuality: '',
      staffBehavior: '',
      cleaningQuality: '',
      waitingTime: '',
      valueForMoney: '',
      wouldRecommend: '',
      additionalServices: [],
      suggestions: '',
      visitFrequency: ''
    });
    setCurrentStep(1);
  };

  const handleServiceChange = (service: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        additionalServices: [...formData.additionalServices, service]
      });
    } else {
      setFormData({
        ...formData,
        additionalServices: formData.additionalServices.filter(s => s !== service)
      });
    }
  };

  const renderStarRating = (value: string, onChange: (value: string) => void) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star.toString())}
            className={`transition-colors hover:scale-110 ${
              parseInt(value) >= star ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            <Star className="w-8 h-8 fill-current" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Raghwa Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-8 rounded-2xl mb-6 shadow-2xl">
            <div className="text-5xl font-bold mb-3">رغوة</div>
            <div className="text-2xl tracking-wider">RAGHWA</div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-4">تجربة العميل</h1>
          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-lg">
            عميلنا العزيز نرحب بكم في رغوة وبدورنا نقدر اهتمامك ونسعى دائماً لتحسين تجربتك معنا.
            <br />
            فنأمل منك المشاركة في تدوين رأيك في استبيان قياس رضا العملاء والمساهمة في تصميم خدمة متميزة تليق بكم وتقييم المنتج والخدمة المقدمة لك
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium text-gray-700">الخطوة {currentStep} من {totalSteps}</span>
            <span className="text-lg font-medium text-blue-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-center text-2xl text-gray-800">
              {currentStep === 1 && "المعلومات الأساسية"}
              {currentStep === 2 && "تقييم الخدمة"}
              {currentStep === 3 && "تقييم الجودة والقيمة"}
              {currentStep === 4 && "ملاحظات وتوصيات"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="customerName" className="text-right block mb-3 text-lg font-medium">اسم العميل</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="أدخل اسمك الكريم"
                    className="text-right text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phoneNumber" className="text-right block mb-3 text-lg font-medium">رقم الهاتف</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    placeholder="05xxxxxxxx"
                    className="text-right text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <Label htmlFor="serviceDate" className="text-right block mb-3 text-lg font-medium">تاريخ الخدمة</Label>
                  <Input
                    id="serviceDate"
                    type="date"
                    value={formData.serviceDate}
                    onChange={(e) => setFormData({...formData, serviceDate: e.target.value})}
                    className="text-right text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label className="text-right block mb-3 text-lg font-medium">كم مرة تزور رغوة؟</Label>
                  <Select value={formData.visitFrequency} onValueChange={(value) => setFormData({...formData, visitFrequency: value})}>
                    <SelectTrigger className="text-right text-lg p-4 border-2 border-gray-200" dir="rtl">
                      <SelectValue placeholder="اختر تكرار الزيارة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-time">المرة الأولى</SelectItem>
                      <SelectItem value="monthly">شهرياً</SelectItem>
                      <SelectItem value="weekly">أسبوعياً</SelectItem>
                      <SelectItem value="daily">يومياً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Service Evaluation */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="text-center">
                  <Label className="text-right block mb-4 text-xl font-medium">تقييمك العام للخدمة</Label>
                  {renderStarRating(formData.overallSatisfaction, (value) => 
                    setFormData({...formData, overallSatisfaction: value})
                  )}
                  <p className="text-gray-600 mt-2">اضغط على النجوم لإعطاء تقييمك</p>
                </div>
                
                <div className="text-center">
                  <Label className="text-right block mb-4 text-xl font-medium">جودة الخدمة المقدمة</Label>
                  {renderStarRating(formData.serviceQuality, (value) => 
                    setFormData({...formData, serviceQuality: value})
                  )}
                </div>
                
                <div className="text-center">
                  <Label className="text-right block mb-4 text-xl font-medium">تعامل الموظفين</Label>
                  {renderStarRating(formData.staffBehavior, (value) => 
                    setFormData({...formData, staffBehavior: value})
                  )}
                </div>
                
                <div>
                  <Label className="text-right block mb-4 text-xl font-medium">وقت الانتظار</Label>
                  <RadioGroup 
                    value={formData.waitingTime} 
                    onValueChange={(value) => setFormData({...formData, waitingTime: value})}
                    className="text-right space-y-3"
                    dir="rtl"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse bg-green-50 p-3 rounded-lg">
                      <RadioGroupItem value="excellent" id="wait-excellent" />
                      <Label htmlFor="wait-excellent" className="text-lg">ممتاز (أقل من 5 دقائق)</Label>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse bg-blue-50 p-3 rounded-lg">
                      <RadioGroupItem value="good" id="wait-good" />
                      <Label htmlFor="wait-good" className="text-lg">جيد (5-10 دقائق)</Label>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse bg-yellow-50 p-3 rounded-lg">
                      <RadioGroupItem value="fair" id="wait-fair" />
                      <Label htmlFor="wait-fair" className="text-lg">مقبول (10-15 دقيقة)</Label>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse bg-red-50 p-3 rounded-lg">
                      <RadioGroupItem value="poor" id="wait-poor" />
                      <Label htmlFor="wait-poor" className="text-lg">ضعيف (أكثر من 15 دقيقة)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Step 3: Quality and Value */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center">
                  <Label className="text-right block mb-4 text-xl font-medium">جودة التنظيف</Label>
                  {renderStarRating(formData.cleaningQuality, (value) => 
                    setFormData({...formData, cleaningQuality: value})
                  )}
                </div>
                
                <div className="text-center">
                  <Label className="text-right block mb-4 text-xl font-medium">القيمة مقابل المال</Label>
                  {renderStarRating(formData.valueForMoney, (value) => 
                    setFormData({...formData, valueForMoney: value})
                  )}
                </div>
                
                <div>
                  <Label className="text-right block mb-4 text-xl font-medium">هل توصي بخدماتنا للآخرين؟</Label>
                  <RadioGroup 
                    value={formData.wouldRecommend} 
                    onValueChange={(value) => setFormData({...formData, wouldRecommend: value})}
                    className="text-right space-y-3"
                    dir="rtl"
                  >
                    <div className="flex items-center space-x-3 space-x-reverse bg-green-50 p-3 rounded-lg">
                      <RadioGroupItem value="definitely" id="recommend-definitely" />
                      <Label htmlFor="recommend-definitely" className="text-lg">بالتأكيد</Label>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse bg-blue-50 p-3 rounded-lg">
                      <RadioGroupItem value="probably" id="recommend-probably" />
                      <Label htmlFor="recommend-probably" className="text-lg">على الأرجح</Label>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse bg-yellow-50 p-3 rounded-lg">
                      <RadioGroupItem value="maybe" id="recommend-maybe" />
                      <Label htmlFor="recommend-maybe" className="text-lg">ربما</Label>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse bg-red-50 p-3 rounded-lg">
                      <RadioGroupItem value="no" id="recommend-no" />
                      <Label htmlFor="recommend-no" className="text-lg">لا</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-right block mb-4 text-xl font-medium">الخدمات الإضافية التي تهتم بها</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      '  داخلي',
                      'تلميع المشروب',
                      'تنظيف المحرك',
                      'العطور والمعطرات',
                      'تنظيف الكج.مي',
                      'حماية الطلاء'
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-3 space-x-reverse bg-gray-50 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                        <Checkbox
                          id={service}
                          checked={formData.additionalServices.includes(service)}
                          onCheckedChange={(checked) => handleServiceChange(service, checked as boolean)}
                        />
                        <Label htmlFor={service} className="text-lg cursor-pointer">{service}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Comments and Suggestions */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <Label htmlFor="suggestions" className="text-right block mb-4 text-xl font-medium">
                    ملاحظاتك ومقترحاتك لتحسين الخدمة
                  </Label>
                  <Textarea
                    id="suggestions"
                    value={formData.suggestions}
                    onChange={(e) => setFormData({...formData, suggestions: e.target.value})}
                    placeholder="شاركنا رأيك وأفكارك لتطوير خدماتنا..."
                    className="text-right min-h-[150px] text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                    dir="rtl"
                  />
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-xl text-right mb-4 text-blue-800">ملخص تقييمك:</h3>
                  <div className="grid grid-cols-2 gap-4 text-right">
                    <div className="bg-white p-3 rounded-lg">
                      <span className="text-gray-600">التقييم العام:</span>
                      <div className="flex justify-end mt-1">
                        {formData.overallSatisfaction ? 
                          getRatingStars(parseInt(formData.overallSatisfaction)) : 
                          <span className="text-gray-400">غير محدد</span>
                        }
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="text-gray-600">جودة الخدمة:</span>
                      <div className="flex justify-end mt-1">
                        {formData.serviceQuality ? 
                          getRatingStars(parseInt(formData.serviceQuality)) : 
                          <span className="text-gray-400">غير محدد</span>
                        }
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="text-gray-600">تعامل الموظفين:</span>
                      <div className="flex justify-end mt-1">
                        {formData.staffBehavior ? 
                          getRatingStars(parseInt(formData.staffBehavior)) : 
                          <span className="text-gray-400">غير محدد</span>
                        }
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <span className="text-gray-600">التوصية:</span>
                      <span className="block mt-1 font-medium text-blue-600">
                        {formData.wouldRecommend || 'غير محدد'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              <Button 
                onClick={handlePrevious} 
                disabled={currentStep === 1}
                variant="outline"
                className="px-8 py-3 text-lg"
              >
                <ChevronRight className="w-5 h-5 ml-2" />
                السابق
              </Button>
              
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                  التالي
                  <ChevronLeft className="w-5 h-5 mr-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700">
                  <Send className="w-5 h-5 ml-2" />
                  إرسال الاستبيان
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p className="text-lg mb-2">شكراً لك على وقتك وثقتك في خدماتنا</p>
          <p className="text-2xl">🚗 رغوة - نظافة تليق بسيارتك</p>
        </div>
      </div>
    </div>
  );

  function getRatingStars(rating: number) {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  }
}