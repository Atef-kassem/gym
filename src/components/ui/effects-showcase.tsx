import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, Star, Wand2, Camera, Rocket, Heart, Crown } from 'lucide-react';
import { AnimatedButton, InteractiveCard, StatusBadge, FloatingParticles } from './animated-components';

interface EffectsShowcaseProps {
  className?: string;
}

export function EffectsShowcase({ className = "" }: EffectsShowcaseProps) {
  const [activeEffect, setActiveEffect] = useState('buttons');

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 animate-fade-in-down">
          <div className="p-2 bg-white/20 rounded-lg animate-float">
            <Sparkles className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold">معرض التأثيرات البصرية المتقدمة</span>
          <Badge className="bg-white/20 text-white border-0 animate-pulse">
            <Star className="h-3 w-3 mr-1" />
            جديد
          </Badge>
        </CardTitle>
        <FloatingParticles count={8} />
      </CardHeader>

      <CardContent className="p-6">
        <Tabs value={activeEffect} onValueChange={setActiveEffect} className="w-full">
          <TabsList className="grid w-full grid-cols-4 p-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl">
            <TabsTrigger value="buttons" className="rounded-lg transition-all duration-300 hover:scale-105">
              الأزرار المتحركة
            </TabsTrigger>
            <TabsTrigger value="cards" className="rounded-lg transition-all duration-300 hover:scale-105">
              البطاقات التفاعلية
            </TabsTrigger>
            <TabsTrigger value="status" className="rounded-lg transition-all duration-300 hover:scale-105">
              شارات الحالة
            </TabsTrigger>
            <TabsTrigger value="animations" className="rounded-lg transition-all duration-300 hover:scale-105">
              التحريكات المتقدمة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">الأزرار الأساسية</h3>
                <AnimatedButton variant="primary" animation="glow">
                  <Rocket className="h-4 w-4 mr-2" />
                  زر متوهج
                </AnimatedButton>
                <AnimatedButton variant="success" animation="float">
                  <Heart className="h-4 w-4 mr-2" />
                  زر عائم
                </AnimatedButton>
                <AnimatedButton variant="warning" animation="bounce">
                  <Star className="h-4 w-4 mr-2" />
                  زر متحرك
                </AnimatedButton>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">الأزرار المتقدمة</h3>
                <AnimatedButton variant="primary" animation="shimmer" size="lg">
                  <Wand2 className="h-5 w-5 mr-2" />
                  تأثير الشيمر
                </AnimatedButton>
                <AnimatedButton variant="danger" animation="heartbeat">
                  <Crown className="h-4 w-4 mr-2" />
                  نبضات القلب
                </AnimatedButton>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">أزرار التحميل</h3>
                <AnimatedButton variant="secondary" loading={true}>
                  جاري التحميل...
                </AnimatedButton>
                <AnimatedButton variant="primary" animation="glow">
                  <Camera className="h-4 w-4 mr-2" />
                  تجربة الكاميرا
                </AnimatedButton>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InteractiveCard hover={true} glow={false}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 animate-pulse" />
                    بطاقة تفاعلية عادية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">هذه بطاقة مع تأثيرات الهوفر البسيطة</p>
                </CardContent>
              </InteractiveCard>

              <InteractiveCard hover={true} glow={true} tilt={true}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500 animate-spin" />
                    بطاقة متقدمة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">بطاقة مع توهج وميلان عند التفاعل</p>
                </CardContent>
              </InteractiveCard>
            </div>
          </TabsContent>

          <TabsContent value="status" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatusBadge status="success" pulse={true}>
                مكتمل
              </StatusBadge>
              <StatusBadge status="warning" glow={true}>
                تحذير
              </StatusBadge>
              <StatusBadge status="error" pulse={true}>
                خطأ
              </StatusBadge>
              <StatusBadge status="info" glow={true}>
                معلومات
              </StatusBadge>
              <StatusBadge status="processing" pulse={true} glow={true}>
                جاري المعالجة
              </StatusBadge>
            </div>
          </TabsContent>

          <TabsContent value="animations" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-4 border rounded-lg animate-fade-in-up">
                <h4 className="font-semibold mb-2">ظهور من الأسفل</h4>
                <p className="text-sm text-gray-600">تأثير fade-in-up</p>
              </div>
              
              <div className="p-4 border rounded-lg animate-slide-in-right">
                <h4 className="font-semibold mb-2">انزلاق من اليمين</h4>
                <p className="text-sm text-gray-600">تأثير slide-in-right</p>
              </div>
              
              <div className="p-4 border rounded-lg animate-bounce-in">
                <h4 className="font-semibold mb-2">ظهور مرتد</h4>
                <p className="text-sm text-gray-600">تأثير bounce-in</p>
              </div>
              
              <div className="p-4 border rounded-lg animate-float">
                <h4 className="font-semibold mb-2">عوم مستمر</h4>
                <p className="text-sm text-gray-600">تأثير float</p>
              </div>
              
              <div className="p-4 border rounded-lg animate-glow-pulse">
                <h4 className="font-semibold mb-2">نبضة متوهجة</h4>
                <p className="text-sm text-gray-600">تأثير glow-pulse</p>
              </div>
              
              <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white animate-gradient-x">
                <h4 className="font-semibold mb-2">تدرج متحرك</h4>
                <p className="text-sm">تأثير gradient-x</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}