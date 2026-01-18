import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '@/contexts/CurrentUserContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';

// Import new step components
import Step1CustomerVehicle from '@/components/POS/Steps/Step1CustomerVehicle';
import Step2ServicesSelection from '@/components/POS/Steps/Step2ServicesSelection';
import Step3Discounts from '@/components/POS/Steps/Step3Discounts';
import Step4Payment from '@/components/POS/Steps/Step4Payment';
import { PaymentSuccessScreen } from '@/components/POS/PaymentSuccessScreen';

// Types
interface Shift {
  id: string;
  startTime: Date;
  initialCash: number;
  cashierId: string;
  cashierName: string;
  status: 'active' | 'closed';
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: 'service' | 'product';
}

interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  value: number;
}

const NewSimplePOSSystem: React.FC = () => {
  const { currentUser } = useCurrentUser();
  
  // Shift Management
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [showShiftDialog, setShowShiftDialog] = useState(true);
  const [initialCash, setInitialCash] = useState('1000');
  
  // POS Flow States
  const [currentStep, setCurrentStep] = useState(1);
  const [customerData, setCustomerData] = useState<any>(null);
  const [vehicleData, setVehicleData] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [appliedDiscounts, setAppliedDiscounts] = useState<Discount[]>([]);
  
  // Payment Success States
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<any>(null);

  // Check for existing shift on load
  useEffect(() => {
    const savedShift = localStorage.getItem('activeShift');
    if (savedShift) {
      setCurrentShift(JSON.parse(savedShift));
      setShowShiftDialog(false);
    }
  }, []);

  // Start shift
  const handleStartShift = () => {
    if (!currentUser) return;
    
    const newShift: Shift = {
      id: `shift-${Date.now()}`,
      startTime: new Date(),
      initialCash: parseFloat(initialCash),
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      status: 'active'
    };
    
    setCurrentShift(newShift);
    localStorage.setItem('activeShift', JSON.stringify(newShift));
    setShowShiftDialog(false);
    toast({ title: 'تم بدء الوردية بنجاح' });
  };

  // End shift
  const handleEndShift = () => {
    localStorage.removeItem('activeShift');
    setCurrentShift(null);
    setShowShiftDialog(true);
    resetPOSFlow();
    toast({ title: 'تم إنهاء الوردية' });
  };

  // Reset POS flow
  const resetPOSFlow = () => {
    setCurrentStep(1);
    setCustomerData(null);
    setVehicleData(null);
    setOrderItems([]);
    setAppliedDiscounts([]);
    setShowSuccessScreen(false);
    setCompletedInvoice(null);
  };

  // Step 1: Customer & Vehicle Data
  const handleStep1Next = (customer: any, vehicle: any) => {
    console.log('Step 1 completed:', { customer, vehicle });
    setCustomerData(customer);
    setVehicleData(vehicle);
    setCurrentStep(2);
  };

  // Step 2: Services Selection
  const handleStep2Next = (items: OrderItem[]) => {
    console.log('Step 2 completed:', items);
    setOrderItems(items);
    setCurrentStep(3);
  };

  // Step 3: Discounts
  const handleStep3Next = (discounts: Discount[]) => {
    console.log('Step 3 completed:', discounts);
    setAppliedDiscounts(discounts);
    setCurrentStep(4);
  };

  // Step 4: Payment
  const handlePaymentComplete = (paymentData: any) => {
    console.log('Payment completed:', paymentData);
    
    // Create invoice
    const invoice = {
      id: paymentData.invoiceNumber,
      number: paymentData.invoiceNumber,
      customer: {
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email
      },
      vehicle: vehicleData,
      items: orderItems,
      discounts: appliedDiscounts,
      total: paymentData.total,
      paymentMethod: paymentData.method,
      date: new Date().toISOString(),
      status: 'paid' as const,
      cashier: currentUser?.name || 'غير معروف'
    };
    
    setCompletedInvoice(invoice);
    setShowSuccessScreen(true);
  };

  // Handle new customer after payment success
  const handleNewCustomer = () => {
    setShowSuccessScreen(false);
    resetPOSFlow();
  };

  // Calculate final total
  const calculateFinalTotal = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let total = subtotal;
    
    appliedDiscounts.forEach(discount => {
      if (discount.type === 'percentage') {
        total -= (subtotal * discount.value / 100);
      } else {
        total -= discount.value;
      }
    });
    
    return Math.max(0, total);
  };

  // Shift start dialog
  if (showShiftDialog) {
    return (
      <Dialog open={showShiftDialog} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              بدء وردية جديدة
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">بيانات الكاشير</h3>
              <p className="text-blue-800">{currentUser?.name}</p>
              <p className="text-blue-600 text-sm">{currentUser?.position}</p>
            </div>
            
            <div className="space-y-2">
              <Label>الرصيد النقدي الابتدائي (جنيه)</Label>
              <Input
                type="number"
                value={initialCash}
                onChange={(e) => setInitialCash(e.target.value)}
                placeholder="1000"
              />
            </div>
            
            <Button onClick={handleStartShift} className="w-full">
              <Clock className="h-4 w-4 mr-2" />
              بدء الوردية
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show Payment Success Screen
  if (showSuccessScreen && completedInvoice) {
    return (
      <PaymentSuccessScreen
        invoice={completedInvoice}
        onNewCustomer={handleNewCustomer}
        onClose={() => setShowSuccessScreen(false)}
      />
    );
  }

  // Render current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1CustomerVehicle
            onNext={handleStep1Next}
            onCancel={resetPOSFlow}
          />
        );
      
      case 2:
        return (
          <Step2ServicesSelection
            customerData={customerData}
            vehicleData={vehicleData}
            onNext={handleStep2Next}
            onBack={() => setCurrentStep(1)}
          />
        );
      
      case 3:
        return (
          <Step3Discounts
            customerData={customerData}
            vehicleData={vehicleData}
            orderItems={orderItems}
            onNext={handleStep3Next}
            onBack={() => setCurrentStep(2)}
          />
        );
      
      case 4:
        return (
          <Step4Payment
            customerData={customerData}
            vehicleData={vehicleData}
            orderItems={orderItems}
            appliedDiscounts={appliedDiscounts}
            finalTotal={calculateFinalTotal()}
            onBack={() => setCurrentStep(3)}
            onPaymentComplete={handlePaymentComplete}
          />
        );
      
      default:
        return <div>خطأ في النظام</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Shift Info */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">نظام نقاط البيع</h1>
            <span className="text-sm text-gray-600">
              الوردية: {currentShift?.id} | الكاشير: {currentUser?.name}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
              الخطوة {currentStep} من 4
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleEndShift}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              إنهاء الوردية
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {renderCurrentStep()}
    </div>
  );
};

export default NewSimplePOSSystem;