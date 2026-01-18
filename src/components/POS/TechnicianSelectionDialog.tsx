import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Star, Clock, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface Technician {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  status: 'متاح' | 'مشغول' | 'في استراحة';
  currentTasks: number;
  completedToday: number;
}

interface TechnicianSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTechnician: (technicianId: string, technicianName: string) => void;
}

const mockTechnicians: Technician[] = [
  {
    id: 'tech-001',
    name: 'أحمد محمد',
    specialty: '  خارجي',
    rating: 4.8,
    status: 'متاح',
    currentTasks: 0,
    completedToday: 12
  },
  {
    id: 'tech-002',
    name: 'محمد علي',
    specialty: 'تنظيف داخلي',
    rating: 4.9,
    status: 'متاح',
    currentTasks: 1,
    completedToday: 8
  },
  {
    id: 'tech-003',
    name: 'خالد أحمد',
    specialty: 'تلميع وحماية',
    rating: 4.7,
    status: 'مشغول',
    currentTasks: 2,
    completedToday: 6
  },
  {
    id: 'tech-004',
    name: 'عبدالله محمد',
    specialty: 'صيانة سريعة',
    rating: 4.6,
    status: 'متاح',
    currentTasks: 0,
    completedToday: 15
  },
  {
    id: 'tech-005',
    name: 'سعد الدين',
    specialty: 'خدمات شاملة',
    rating: 4.9,
    status: 'في استراحة',
    currentTasks: 0,
    completedToday: 10
  }
];

export function TechnicianSelectionDialog({ 
  open, 
  onOpenChange, 
  onSelectTechnician 
}: TechnicianSelectionDialogProps) {
  const { toast } = useToast();
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);

  const handleSelectTechnician = (technician: Technician) => {
    setSelectedTechnician(technician.id);
    onSelectTechnician(technician.id, technician.name);
    
    toast({
      title: "تم اختيار الفني",
      description: `تم تعيين ${technician.name} لتنفيذ الخدمات`,
      variant: "default"
    });
    
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'متاح':
        return 'bg-success text-success-foreground';
      case 'مشغول':
        return 'bg-warning text-warning-foreground';
      case 'في استراحة':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'متاح':
        return <CheckCircle className="h-3 w-3" />;
      case 'مشغول':
        return <Clock className="h-3 w-3" />;
      case 'في استراحة':
        return <User className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl animate-fade-in shadow-elegant">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <User className="h-5 w-5" />
            اختيار الفني المناسب
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
          {mockTechnicians.map((technician) => (
            <div 
              key={technician.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                technician.status === 'متاح' 
                  ? 'border-success/30 hover:border-success bg-success/5' 
                  : 'border-muted hover:border-muted-foreground/50 bg-muted/30'
              }`}
              onClick={() => technician.status === 'متاح' && handleSelectTechnician(technician)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold text-foreground">{technician.name}</h4>
                    <p className="text-sm text-muted-foreground">{technician.specialty}</p>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-warning fill-current" />
                      <span className="text-xs text-muted-foreground">{technician.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-left space-y-2">
                  <Badge 
                    className={`${getStatusColor(technician.status)} flex items-center gap-1`}
                  >
                    {getStatusIcon(technician.status)}
                    {technician.status}
                  </Badge>
                  
                  <div className="text-xs text-muted-foreground">
                    <div>المهام الحالية: {technician.currentTasks}</div>
                    <div>أُنجز اليوم: {technician.completedToday}</div>
                  </div>
                </div>
              </div>
              
              {technician.status === 'متاح' && (
                <Button 
                  className="w-full mt-3 bg-primary hover:bg-primary-hover text-primary-foreground transition-spring"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTechnician(technician);
                  }}
                >
                  <CheckCircle className="h-4 w-4 ml-2" />
                  اختيار هذا الفني
                </Button>
              )}
              
              {technician.status !== 'متاح' && (
                <div className="w-full mt-3 p-2 text-center text-sm text-muted-foreground bg-muted/50 rounded">
                  {technician.status === 'مشغول' ? 'الفني مشغول حالياً' : 'الفني في استراحة'}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="transition-spring"
          >
            إلغاء
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}