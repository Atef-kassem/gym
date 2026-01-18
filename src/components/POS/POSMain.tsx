import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Monitor, 
  Settings, 
  CreditCard, 
  FileText, 
  Bell, 
  BarChart3,
  LayoutDashboard,
  Activity
} from 'lucide-react';
import POSDashboard from './POSDashboard';
import POSDevicesManagement from './POSDevicesManagement';
import POSPaymentMethodsManagement from './POSPaymentMethodsManagement';

const POSMain: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    {
      value: 'dashboard',
      label: 'لوحة التحكم',
      icon: <LayoutDashboard className="h-4 w-4" />,
      component: <POSDashboard />
    },
    {
      value: 'devices',
      label: 'الأجهزة',
      icon: <Monitor className="h-4 w-4" />,
      component: <POSDevicesManagement />
    },
    {
      value: 'payments',
      label: 'طرق الدفع',
      icon: <CreditCard className="h-4 w-4" />,
      component: <POSPaymentMethodsManagement />
    },
    {
      value: 'settings',
      label: 'الإعدادات',
      icon: <Settings className="h-4 w-4" />,
      component: <div className="p-6 text-center">إعدادات POS - قيد التطوير</div>
    },
    {
      value: 'invoices',
      label: 'قوالب الإيصالات',
      icon: <FileText className="h-4 w-4" />,
      component: <div className="p-6 text-center">قوالب الإيصالات - قيد التطوير</div>
    },
    {
      value: 'notifications',
      label: 'الإشعارات',
      icon: <Bell className="h-4 w-4" />,
      component: <div className="p-6 text-center">الإشعارات - قيد التطوير</div>
    },
    {
      value: 'reports',
      label: 'التقارير',
      icon: <BarChart3 className="h-4 w-4" />,
      component: <div className="p-6 text-center">التقارير - قيد التطوير</div>
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">نظام نقاط البيع (POS)</h1>
            <p className="text-gray-600">إدارة شاملة لنظام نقاط البيع</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>متصل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center space-x-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
              >
                {tab.icon}
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="space-y-6">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">الأجهزة النشطة</div>
              <div className="text-xs text-gray-500">12 جهاز</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">طرق الدفع</div>
              <div className="text-xs text-gray-500">8 طرق</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">قوالب الإيصالات</div>
              <div className="text-xs text-gray-500">5 قوالب</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-orange-500" />
            <div>
              <div className="text-sm font-medium text-gray-900">الإشعارات</div>
              <div className="text-xs text-gray-500">3 معلقة</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSMain;
