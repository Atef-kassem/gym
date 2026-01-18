import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import mobileWashData from '@/data/mobileWash.json';

// Types
export interface BookingData {
  id: string;
  customerName: string;
  phoneNumber: string;
  email: string;
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    district: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
  };
  serviceDetails: {
    type: string;
    package: string;
    services: string[];
    duration: number;
    price: number;
  };
  scheduling: {
    date: string;
    time: string;
    estimatedEndTime: string;
  };
  assignment: {
    vehicleId: string;
    technicianId: string;
    technicianName: string;
  };
  status: 'مجدول' | 'في الطريق' | 'في التنفيذ' | 'مكتمل' | 'ملغي';
  priority?: 'high' | 'normal' | 'low';
  paymentStatus: string;
  paymentMethod: string;
  notes: string;
  progress: number;
  timestamps: {
    created: string;
    confirmed?: string;
    started?: string;
    completed?: string;
    updated: string;
  };
  rating?: number;
  feedback?: string;
}

export interface FleetVehicle {
  id: string;
  name: string;
  details: {
    make: string;
    model: string;
    year: string;
    plateNumber: string;
    vin: string;
  };
  driver: {
    id: string;
    name: string;
    phone: string;
    email: string;
    licenseNumber: string;
    experience: string;
    rating: number;
    specialties: string[];
  };
  location: {
    current: {
      address: string;
      coordinates: { lat: number; lng: number };
    };
    lastUpdate: string;
  };
  status: {
    operational: string;
    availability: string;
    currentBooking?: string;
  };
  vehicle: {
    fuelLevel: number;
    mileage: number;
    speed: number;
    engineHours: number;
  };
  maintenance: {
    lastService: string;
    nextService: string;
    serviceInterval: number;
    status: string;
  };
  equipment: Array<{
    name: string;
    model?: string;
    capacity?: string;
    power?: string;
    level?: string;
    status: string;
  }>;
  performance: {
    todayServices: number;
    weeklyServices: number;
    monthlyServices: number;
    totalRevenue: number;
    averageRating: number;
    efficiency: number;
  };
}

export interface CustomerData {
  id: string;
  personalInfo: {
    name: string;
    phone: string;
    email: string;
    dateOfBirth: string;
    gender: string;
  };
  address: {
    street: string;
    district: string;
    city: string;
    postalCode: string;
  };
  vehicles: Array<{
    id: string;
    make: string;
    model: string;
    year: string;
    color: string;
    plateNumber: string;
  }>;
  preferences: {
    preferredTime: string;
    preferredServices: string[];
    ecoFriendly: boolean;
    notifications: {
      sms: boolean;
      email: boolean;
      whatsapp: boolean;
    };
  };
  history: {
    totalBookings: number;
    totalSpent: number;
    averageRating: number;
    lastService: string;
    loyaltyPoints: number;
  };
  status: string;
  vipStatus: string;
  joinDate: string;
}

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useMobileWashData = () => {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [quality, setQuality] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await delay(1000); // Simulate API call
        setBookings(mobileWashData.bookings as BookingData[]);
        setFleet(mobileWashData.fleet as FleetVehicle[]);
        setCustomers(mobileWashData.customers as CustomerData[]);
        setServices(mobileWashData.services);
        setAnalytics(mobileWashData.analytics);
        setQuality(mobileWashData.quality);
      } catch (err) {
        setError('فشل في تحميل البيانات');
        toast({
          title: "خطأ",
          description: "فشل في تحميل البيانات",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [toast]);

  // Booking operations
  const createBooking = useCallback(async (bookingData: Partial<BookingData>) => {
    setLoading(true);
    try {
      await delay(800);
      const newBooking: BookingData = {
        id: `MW${String(bookings.length + 1).padStart(3, '0')}`,
        customerName: bookingData.customerName || '',
        phoneNumber: bookingData.phoneNumber || '',
        email: bookingData.email || '',
        location: bookingData.location || {
          address: '',
          coordinates: { lat: 0, lng: 0 },
          district: ''
        },
        vehicleInfo: bookingData.vehicleInfo || {
          make: '',
          model: '',
          year: '',
          color: '',
          plateNumber: ''
        },
        serviceDetails: bookingData.serviceDetails || {
          type: '',
          package: '',
          services: [],
          duration: 0,
          price: 0
        },
        scheduling: bookingData.scheduling || {
          date: '',
          time: '',
          estimatedEndTime: ''
        },
        assignment: bookingData.assignment || {
          vehicleId: '',
          technicianId: '',
          technicianName: ''
        },
        status: 'مجدول',
        paymentStatus: 'في الانتظار',
        paymentMethod: '',
        notes: bookingData.notes || '',
        progress: 0,
        timestamps: {
          created: new Date().toISOString(),
          updated: new Date().toISOString()
        }
      };

      setBookings(prev => [...prev, newBooking]);
      
      toast({
        title: "تم إنشاء الحجز",
        description: `تم إنشاء الحجز ${newBooking.id} بنجاح`
      });
      
      return newBooking;
    } catch (err) {
      setError('فشل في إنشاء الحجز');
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الحجز",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [bookings.length, toast]);

  const updateBooking = useCallback(async (id: string, updates: Partial<BookingData>) => {
    setLoading(true);
    try {
      await delay(500);
      setBookings(prev => prev.map(booking => 
        booking.id === id 
          ? { 
              ...booking, 
              ...updates, 
              timestamps: {
                ...booking.timestamps,
                updated: new Date().toISOString()
              }
            }
          : booking
      ));
      
      toast({
        title: "تم تحديث الحجز",
        description: `تم تحديث الحجز ${id} بنجاح`
      });
    } catch (err) {
      setError('فشل في تحديث الحجز');
      toast({
        title: "خطأ",
        description: "فشل في تحديث الحجز",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteBooking = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await delay(500);
      setBookings(prev => prev.filter(booking => booking.id !== id));
      
      toast({
        title: "تم حذف الحجز",
        description: `تم حذف الحجز ${id} بنجاح`,
        variant: "destructive"
      });
    } catch (err) {
      setError('فشل في حذف الحجز');
      toast({
        title: "خطأ",
        description: "فشل في حذف الحجز",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fleet operations
  const updateVehicleStatus = useCallback(async (vehicleId: string, status: Partial<FleetVehicle['status']>) => {
    setLoading(true);
    try {
      await delay(500);
      setFleet(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { 
              ...vehicle, 
              status: { ...vehicle.status, ...status },
              location: {
                ...vehicle.location,
                lastUpdate: new Date().toISOString()
              }
            }
          : vehicle
      ));
      
      toast({
        title: "تم تحديث حالة المركبة",
        description: `تم تحديث حالة المركبة ${vehicleId}`
      });
    } catch (err) {
      setError('فشل في تحديث حالة المركبة');
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة المركبة",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateVehicleLocation = useCallback(async (vehicleId: string, location: FleetVehicle['location']['current']) => {
    try {
      setFleet(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { 
              ...vehicle, 
              location: {
                current: location,
                lastUpdate: new Date().toISOString()
              }
            }
          : vehicle
      ));
    } catch (err) {
      console.error('Failed to update vehicle location:', err);
    }
  }, []);

  // Customer operations
  const createCustomer = useCallback(async (customerData: Partial<CustomerData>) => {
    setLoading(true);
    try {
      await delay(800);
      const newCustomer: CustomerData = {
        id: `C${String(customers.length + 1).padStart(3, '0')}`,
        personalInfo: customerData.personalInfo || {
          name: '',
          phone: '',
          email: '',
          dateOfBirth: '',
          gender: ''
        },
        address: customerData.address || {
          street: '',
          district: '',
          city: '',
          postalCode: ''
        },
        vehicles: customerData.vehicles || [],
        preferences: customerData.preferences || {
          preferredTime: '',
          preferredServices: [],
          ecoFriendly: false,
          notifications: {
            sms: true,
            email: true,
            whatsapp: true
          }
        },
        history: {
          totalBookings: 0,
          totalSpent: 0,
          averageRating: 0,
          lastService: '',
          loyaltyPoints: 0
        },
        status: 'نشط',
        vipStatus: 'عادي',
        joinDate: new Date().toISOString().split('T')[0]
      };

      setCustomers(prev => [...prev, newCustomer]);
      
      toast({
        title: "تم إنشاء العميل",
        description: `تم إنشاء ملف العميل ${newCustomer.personalInfo.name} بنجاح`
      });
      
      return newCustomer;
    } catch (err) {
      setError('فشل في إنشاء العميل');
      toast({
        title: "خطأ",
        description: "فشل في إنشاء العميل",
        variant: "destructive"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [customers.length, toast]);

  // Search and filter functions
  const searchBookings = useCallback((query: string, filters?: any) => {
    return bookings.filter(booking => {
      const matchesQuery = 
        booking.customerName.toLowerCase().includes(query.toLowerCase()) ||
        booking.phoneNumber.includes(query) ||
        booking.id.toLowerCase().includes(query.toLowerCase()) ||
        booking.vehicleInfo.plateNumber.includes(query);
      
      let matchesFilters = true;
      if (filters?.status && filters.status !== 'all') {
        matchesFilters = matchesFilters && booking.status === filters.status;
      }
      if (filters?.date) {
        matchesFilters = matchesFilters && booking.scheduling.date === filters.date;
      }
      
      return matchesQuery && matchesFilters;
    });
  }, [bookings]);

  const searchFleet = useCallback((query: string, filters?: any) => {
    return fleet.filter(vehicle => {
      const matchesQuery = 
        vehicle.name.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.id.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.driver.name.toLowerCase().includes(query.toLowerCase()) ||
        vehicle.details.plateNumber.includes(query);
      
      let matchesFilters = true;
      if (filters?.status && filters.status !== 'all') {
        matchesFilters = matchesFilters && vehicle.status.operational === filters.status;
      }
      
      return matchesQuery && matchesFilters;
    });
  }, [fleet]);

  // Analytics functions
  const getAnalytics = useCallback((dateRange?: { start: string; end: string }) => {
    // In a real app, this would filter analytics by date range
    return analytics;
  }, [analytics]);

  const getPerformanceMetrics = useCallback(() => {
    if (!analytics) return null;
    
    return {
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.status === 'مكتمل').length,
      activeVehicles: fleet.filter(v => v.status.operational === 'نشط').length,
      averageRating: analytics.overview.customerSatisfaction,
      totalRevenue: analytics.overview.totalRevenue
    };
  }, [bookings, fleet, analytics]);

  return {
    // Data
    bookings,
    fleet,
    customers,
    services,
    analytics,
    quality,
    loading,
    error,
    
    // Booking operations
    createBooking,
    updateBooking,
    deleteBooking,
    
    // Fleet operations
    updateVehicleStatus,
    updateVehicleLocation,
    
    // Customer operations
    createCustomer,
    
    // Search and filter
    searchBookings,
    searchFleet,
    
    // Analytics
    getAnalytics,
    getPerformanceMetrics,
    
    // Utility
    refreshData: () => {
      toast({
        title: "تم تحديث البيانات",
        description: "تم تحديث جميع البيانات بنجاح"
      });
    }
  };
};