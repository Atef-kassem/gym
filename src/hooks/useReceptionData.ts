import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  loyaltyPoints: number;
  totalVisits: number;
  lastVisit: string;
  vehicleCount: number;
  rating: number;
  membershipType: 'عادي' | 'مميز' | 'VIP';
}

export interface Vehicle {
  id: string;
  customerId: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  lastService: string;
  nextService: string;
  serviceHistory: ServiceRecord[];
}

export interface ServiceRecord {
  id: string;
  vehicleId: string;
  customerId: string;
  serviceType: string;
  date: string;
  amount: number;
  notes?: string;
  rating?: number;
}

export interface WorkOrder {
  id: string;
  customerId: string;
  customerName: string;
  vehicleId: string;
  plateNumber: string;
  services: string[];
  status: 'منتظر' | 'قيد التنفيذ' | 'جاهز' | 'مكتمل' | 'ملغي';
  priority: 'عادي' | 'عاجل' | 'طارئ';
  createdAt: string;
  estimatedCompletion: string;
  actualCompletion?: string;
  totalAmount: number;
  assignedEmployee: string;
  queuePosition: number;
  notes?: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  vehicleId: string;
  plateNumber: string;
  date: string;
  time: string;
  services: string[];
  status: 'مؤكد' | 'منتظر' | 'ملغي' | 'مكتمل';
  notes?: string;
  reminderSent: boolean;
}

export interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  type: 'شكوى' | 'اقتراح' | 'استفسار';
  category: 'جودة الخدمة' | 'وقت الانتظار' | 'أسعار' | 'موظفين' | 'أخرى';
  description: string;
  priority: 'منخفض' | 'متوسط' | 'عالي' | 'حرج';
  status: 'جديد' | 'قيد المراجعة' | 'قيد المعالجة' | 'محلول' | 'مغلق';
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  resolution?: string;
  customerSatisfaction?: number;
}

export const useReceptionData = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize sample data
  useEffect(() => {
    const sampleCustomers: Customer[] = [
      {
        id: '1',
        name: 'أحمد محمد عبدالله',
        phone: '0501234567',
        email: 'ahmed@example.com',
        loyaltyPoints: 850,
        totalVisits: 12,
        lastVisit: '2024-01-20',
        vehicleCount: 2,
        rating: 4.8,
        membershipType: 'VIP'
      },
      {
        id: '2',
        name: 'فاطمة أحمد السالم',
        phone: '0509876543',
        email: 'fatima@example.com',
        loyaltyPoints: 320,
        totalVisits: 5,
        lastVisit: '2024-01-18',
        vehicleCount: 1,
        rating: 4.2,
        membershipType: 'مميز'
      },
      {
        id: '3',
        name: 'محمد عبدالرحمن النصر',
        phone: '0505555555',
        loyaltyPoints: 120,
        totalVisits: 3,
        lastVisit: '2024-01-15',
        vehicleCount: 1,
        rating: 4.0,
        membershipType: 'عادي'
      }
    ];

    const sampleVehicles: Vehicle[] = [
      {
        id: '1',
        customerId: '1',
        plateNumber: 'ر ق ب 1234',
        brand: 'تويوتا',
        model: 'كامري',
        year: 2022,
        color: 'أبيض',
        lastService: '2024-01-15',
        nextService: '2024-04-15',
        serviceHistory: []
      },
      {
        id: '2',
        customerId: '1',
        plateNumber: 'أ ب ج 5678',
        brand: 'هوندا',
        model: 'أكورد',
        year: 2021,
        color: 'أسود',
        lastService: '2024-01-10',
        nextService: '2024-04-10',
        serviceHistory: []
      },
      {
        id: '3',
        customerId: '2',
        plateNumber: 'د هـ و 9012',
        brand: 'نيسان',
        model: 'التيما',
        year: 2020,
        color: 'فضي',
        lastService: '2024-01-08',
        nextService: '2024-04-08',
        serviceHistory: []
      }
    ];

    const sampleWorkOrders: WorkOrder[] = [
      {
        id: '1',
        customerId: '1',
        customerName: 'أحمد محمد عبدالله',
        vehicleId: '1',
        plateNumber: 'ر ق ب 1234',
        services: ['  خارجي', 'تنظيف داخلي', 'تلميع'],
        status: 'قيد التنفيذ',
        priority: 'عادي',
        createdAt: '2024-01-25T10:00:00',
        estimatedCompletion: '2024-01-25T11:30:00',
        totalAmount: 150,
        assignedEmployee: 'محمد أحمد',
        queuePosition: 1
      },
      {
        id: '2',
        customerId: '2',
        customerName: 'فاطمة أحمد السالم',
        vehicleId: '3',
        plateNumber: 'د هـ و 9012',
        services: ['  سريع'],
        status: 'منتظر',
        priority: 'عادي',
        createdAt: '2024-01-25T10:15:00',
        estimatedCompletion: '2024-01-25T11:00:00',
        totalAmount: 50,
        assignedEmployee: 'علي حسن',
        queuePosition: 2
      }
    ];

    const sampleBookings: Booking[] = [
      {
        id: '1',
        customerId: '3',
        customerName: 'محمد عبدالرحمن النصر',
        phone: '0505555555',
        vehicleId: '4',
        plateNumber: 'س ت ث 3456',
        date: '2024-01-26',
        time: '14:00',
        services: ['  شامل', 'تشميع'],
        status: 'مؤكد',
        reminderSent: false
      }
    ];

    const sampleComplaints: Complaint[] = [
      {
        id: '1',
        customerId: '2',
        customerName: 'فاطمة أحمد السالم',
        type: 'شكوى',
        category: 'وقت الانتظار',
        description: 'انتظار طويل جداً رغم الحجز المسبق',
        priority: 'متوسط',
        status: 'قيد المراجعة',
        createdAt: '2024-01-24T16:30:00'
      }
    ];

    setCustomers(sampleCustomers);
    setVehicles(sampleVehicles);
    setWorkOrders(sampleWorkOrders);
    setBookings(sampleBookings);
    setComplaints(sampleComplaints);
  }, []);

  // Customer management
  const addCustomer = useCallback((customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString()
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast({
      title: "تم إضافة العميل",
      description: `تم إضافة العميل ${customer.name} بنجاح`,
    });
    return newCustomer;
  }, []);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
    toast({
      title: "تم تحديث بيانات العميل",
      description: "تم حفظ التغييرات بنجاح",
    });
  }, []);

  // Work order management
  const createWorkOrder = useCallback((workOrder: Omit<WorkOrder, 'id' | 'createdAt' | 'queuePosition'>) => {
    const newWorkOrder: WorkOrder = {
      ...workOrder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      queuePosition: workOrders.filter(wo => wo.status === 'منتظر').length + 1
    };
    setWorkOrders(prev => [...prev, newWorkOrder]);
    toast({
      title: "تم إنشاء أمر عمل جديد",
      description: `تم إنشاء أمر العمل رقم ${newWorkOrder.id}`,
    });
    return newWorkOrder;
  }, [workOrders]);

  const updateWorkOrderStatus = useCallback((id: string, status: WorkOrder['status']) => {
    setWorkOrders(prev => prev.map(order => {
      if (order.id === id) {
        const updatedOrder = { ...order, status };
        if (status === 'مكتمل') {
          updatedOrder.actualCompletion = new Date().toISOString();
        }
        return updatedOrder;
      }
      return order;
    }));
    toast({
      title: "تم تحديث حالة أمر العمل",
      description: `تم تحديث الحالة إلى: ${status}`,
    });
  }, []);

  // Booking management
  const createBooking = useCallback((booking: Omit<Booking, 'id'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString()
    };
    setBookings(prev => [...prev, newBooking]);
    toast({
      title: "تم إنشاء حجز جديد",
      description: `تم حجز موعد في ${booking.date} الساعة ${booking.time}`,
    });
    return newBooking;
  }, []);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
    toast({
      title: "تم تحديث حالة الحجز",
      description: `تم تحديث الحالة إلى: ${status}`,
    });
  }, []);

  // Complaint management
  const createComplaint = useCallback((complaint: Omit<Complaint, 'id' | 'createdAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'جديد'
    };
    setComplaints(prev => [...prev, newComplaint]);
    toast({
      title: "تم تسجيل الشكوى/الاستفسار",
      description: "سنقوم بالرد في أقرب وقت ممكن",
    });
    return newComplaint;
  }, []);

  const updateComplaintStatus = useCallback((id: string, status: Complaint['status'], resolution?: string) => {
    setComplaints(prev => prev.map(complaint => {
      if (complaint.id === id) {
        const updatedComplaint = { ...complaint, status };
        if (status === 'محلول' && resolution) {
          updatedComplaint.resolution = resolution;
          updatedComplaint.resolvedAt = new Date().toISOString();
        }
        return updatedComplaint;
      }
      return complaint;
    }));
    toast({
      title: "تم تحديث حالة الشكوى",
      description: `تم تحديث الحالة إلى: ${status}`,
    });
  }, []);

  // Get functions
  const getCustomerById = useCallback((id: string) => {
    return customers.find(customer => customer.id === id);
  }, [customers]);

  const getVehiclesByCustomerId = useCallback((customerId: string) => {
    return vehicles.filter(vehicle => vehicle.customerId === customerId);
  }, [vehicles]);

  const getWorkOrdersByStatus = useCallback((status: WorkOrder['status']) => {
    return workOrders.filter(order => order.status === status);
  }, [workOrders]);

  const getTodayBookings = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === today);
  }, [bookings]);

  const getActiveComplaints = useCallback(() => {
    return complaints.filter(complaint => 
      !['محلول', 'مغلق'].includes(complaint.status)
    );
  }, [complaints]);

  return {
    // Data
    customers,
    vehicles,
    workOrders,
    bookings,
    complaints,
    loading,
    
    // Customer functions
    addCustomer,
    updateCustomer,
    getCustomerById,
    getVehiclesByCustomerId,
    
    // Work order functions
    createWorkOrder,
    updateWorkOrderStatus,
    getWorkOrdersByStatus,
    
    // Booking functions
    createBooking,
    updateBookingStatus,
    getTodayBookings,
    
    // Complaint functions
    createComplaint,
    updateComplaintStatus,
    getActiveComplaints,
  };
};