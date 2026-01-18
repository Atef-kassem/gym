import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Printer, Share, FileText, UserCheck, Bell, RotateCcw, Plus, Settings, Phone } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { TechnicianSelectionDialog } from "./TechnicianSelectionDialog";
import { useState } from "react";

interface InvoiceActionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  customerPhone: string;
  customerName: string;
  onPrint: () => void;
  onShare: () => void;
  onReset?: () => void;
}

export function InvoiceActionsDialog({ 
  open, 
  onOpenChange, 
  orderId, 
  customerPhone,
  customerName,
  onPrint, 
  onShare,
  onReset
}: InvoiceActionsDialogProps) {
  const { toast } = useToast();
  const [showTechnicianDialog, setShowTechnicianDialog] = useState(false);
  const [selectedTechnicianName, setSelectedTechnicianName] = useState<string | null>(null);

  const handlePrint = () => {
    console.log("Print button clicked");
    onPrint();
    toast({ 
      title: "جاري طباعة الايصال...", 
      description: "سيتم طباعة الايصال خلال ثوانٍ",
      variant: "default" 
    });
  };

  const handleShare = () => {
    console.log("Share button clicked");
    const message = `مرحباً ${customerName}،\n\nتم إصدار فاتورتك بنجاح ✅\nرقم الطلب: ${orderId}\n\nشكراً لاختيارك رغوة - خبراء العناية ب الكافية 🚗💙`;
    const whatsappUrl = `https://wa.me/${customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    onShare();
    toast({ 
      title: "تم فتح واتساب", 
      description: "يمكنك الآن مشاركة تفاصيل الايصال مع العميل",
      variant: "default" 
    });
  };

  const handleCreateWorkOrder = () => {
    console.log("Create work order button clicked");
    if (selectedTechnicianName) {
      toast({ 
        title: "تم إنشاء أمر العمل بنجاح", 
        description: `تم إنشاء أمر العمل وتعيينه للفني ${selectedTechnicianName}`,
        variant: "default" 
      });
    } else {
      toast({ 
        title: "يجب اختيار فني أولاً", 
        description: "الرجاء اختيار الفني المناسب قبل إنشاء أمر العمل",
        variant: "destructive" 
      });
    }
  };

  const handleSelectTechnician = () => {
    console.log("Select technician button clicked");
    setShowTechnicianDialog(true);
  };

  const onSelectTechnician = (technicianId: string, technicianName: string) => {
    setSelectedTechnicianName(technicianName);
    toast({ 
      title: "تم تعيين الفني", 
      description: `تم تعيين ${technicianName} لتنفيذ الخدمات`,
      variant: "default" 
    });
  };

  const handleTechnicianReassignment = () => {
    console.log("Technician reassignment button clicked");
    if (selectedTechnicianName) {
      setShowTechnicianDialog(true);
      toast({ 
        title: "إعادة تعيين الفني", 
        description: "اختر فنياً آخر لتنفيذ الخدمات",
        variant: "default" 
      });
    } else {
      toast({ 
        title: "لم يتم تعيين فني بعد", 
        description: "يجب تعيين فني أولاً قبل إعادة التعيين",
        variant: "destructive" 
      });
    }
  };

  const handleNotifyCustomer = () => {
    console.log("Notify customer button clicked");
    if (selectedTechnicianName) {
      toast({ 
        title: "تم إرسال الإشعار للعميل", 
        description: `تم إرسال تفاصيل الطلب والفني المعين (${selectedTechnicianName}) إلى ${customerName}`,
        variant: "default" 
      });
    } else {
      toast({ 
        title: "تم إرسال الإشعار للعميل", 
        description: `تم إرسال تفاصيل الطلب إلى ${customerName}. سيتم تحديث بيانات الفني لاحقاً`,
        variant: "default" 
      });
    }
  };


  const handleNewOrder = () => {
    console.log("New order button clicked");
    onOpenChange(false);
    setTimeout(() => {
      if (onReset) onReset();
    }, 200);
    toast({ 
      title: "جاهز لطلب جديد", 
      description: "يمكنك الآن إدخال بيانات عميل جديد",
      variant: "default" 
    });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal={true}>
      <DialogContent className="max-w-lg animate-bounce-in shadow-elegant border-0 bg-gradient-card [&>button]:hidden">
        <DialogHeader className="text-center space-y-3 flex flex-col items-center">
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-success animate-glow-pulse" />
              <div className="absolute inset-0 animate-ping">
                <CheckCircle className="h-16 w-16 text-success opacity-75" />
              </div>
            </div>
          </div>
          
          <DialogTitle className="text-2xl font-bold text-primary text-center">
            تم إصدار الايصال بنجاح
          </DialogTitle>
          
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-base px-4 py-2 bg-gradient-primary text-primary-foreground">
              رقم الطلب: {orderId}
            </Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* بيانات العميل */}
          {(customerName || customerPhone) && (
            <div className="bg-accent/50 p-4 rounded-lg border border-accent transition-smooth hover:bg-accent/70">
              <h4 className="font-semibold text-accent-foreground mb-2 flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                بيانات العميل
              </h4>
              {customerName && (
                <div className="text-sm text-accent-foreground">
                  الاسم: {customerName}
                  {customerPhone && (
                    <span className="mr-4 flex items-center gap-1 inline-flex">
                      <Phone className="h-3 w-3" />
                      الهاتف: {customerPhone}
                    </span>
                  )}
                </div>
              )}
              {!customerName && customerPhone && (
                <div className="text-sm text-accent-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  الهاتف: {customerPhone}
                </div>
              )}
            </div>
          )}

          {/* الأزرار الرئيسية - ثنائية */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handlePrint}
              className="bg-primary hover:bg-primary-hover text-primary-foreground transition-spring hover-lift shadow-soft h-12"
            >
              <Printer className="h-4 w-4 ml-2" />
              طباعة الايصال
            </Button>

            <Button 
              onClick={handleShare}
              className="bg-success hover:bg-success/90 text-success-foreground transition-spring hover-lift shadow-soft h-12"
            >
              <Share className="h-4 w-4 ml-2" />
              مشاركة واتساب
            </Button>

            {/* اختيار الفني - أولاً */}
            <Button 
              onClick={handleSelectTechnician}
              className={`transition-spring hover-lift shadow-soft h-12 ${
                selectedTechnicianName 
                  ? 'bg-success hover:bg-success/90 text-success-foreground' 
                  : 'bg-warning hover:bg-warning/90 text-warning-foreground'
              }`}
            >
              <UserCheck className="h-4 w-4 ml-2" />
              {selectedTechnicianName ? `الفني: ${selectedTechnicianName}` : 'اختيار الفني'}
            </Button>

            {/* إنشاء أمر العمل - ثانياً */}
            <Button 
              onClick={handleCreateWorkOrder}
              className={`transition-spring hover-lift shadow-soft h-12 ${
                selectedTechnicianName 
                  ? 'bg-secondary-cyan hover:bg-secondary-cyan/90 text-secondary-cyan-foreground' 
                  : 'bg-muted hover:bg-muted/90 text-muted-foreground cursor-not-allowed'
              }`}
              disabled={!selectedTechnicianName}
            >
              <FileText className="h-4 w-4 ml-2" />
              إنشاء أمر العمل
            </Button>

            <Button 
              onClick={handleNotifyCustomer}
              className="bg-raghwa hover:bg-primary-hover text-primary-foreground transition-spring hover-lift shadow-soft h-12"
            >
              <Bell className="h-4 w-4 ml-2" />
              إرسال إشعار للعميل
            </Button>

            {/* إعادة تعيين الفني - فقط بعد اختيار فني */}
            {selectedTechnicianName && (
              <Button 
                onClick={handleTechnicianReassignment}
                variant="outline"
                className="border-muted-foreground/30 hover:bg-muted hover:border-primary transition-spring hover-lift h-12"
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                إعادة تعيين الفني
              </Button>
            )}
          </div>

          {/* زر طلب جديد */}
          <div className="pt-4 border-t border-border">
            <Button 
              onClick={handleNewOrder}
              className="w-full bg-gradient-primary hover:shadow-elegant text-primary-foreground transition-spring hover-lift animate-glow-pulse h-12"
            >
              <Plus className="h-4 w-4 ml-2" />
              طلب جديد
            </Button>
          </div>
        </div>
        
        {/* Technician Selection Dialog */}
        <TechnicianSelectionDialog
          open={showTechnicianDialog}
          onOpenChange={setShowTechnicianDialog}
          onSelectTechnician={onSelectTechnician}
        />
      </DialogContent>
    </Dialog>
  );
}