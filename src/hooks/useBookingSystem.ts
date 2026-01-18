import { useState, useEffect, useCallback } from 'react';
import { useGetAllBookingsQuery } from '@/services/bookingApi';

interface BookingData {
  id: string;
  customerName: string;
  customerPhone: string;
  customerType: "new" | "existing" | "vip" | "regular";
  vehicleModel?: string;
  plateNumber?: string;
  vehicleType?: string;
  services: string[];
  branch: string;
  servicePath: string;
  assignedEmployee?: string;
  date: string;
  time: string;
  duration: number;
  totalPrice: number;
  bookingType: "direct" | "app" | "recurring" | "urgent";
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "no-show";
  priority: "high" | "normal" | "low";
  notes: string;
  paymentStatus: "unpaid" | "partial" | "paid";
  reminderSent: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  workOrderId?: string;
}

interface UseBookingSystemReturn {
  bookings: BookingData[];
  addBooking: (booking: Omit<BookingData, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBooking: (id: string, updates: Partial<BookingData>) => void;
  deleteBooking: (id: string) => void;
  getBookingById: (id: string) => BookingData | undefined;
  getBookingsByDate: (date: string) => BookingData[];
  getBookingsByBranch: (branch: string) => BookingData[];
  getBookingsByStatus: (status: BookingData['status']) => BookingData[];
  searchBookings: (query: string) => BookingData[];
}

// Global bookings state
let globalBookings: BookingData[] = [];
const subscribers: Array<(bookings: BookingData[]) => void> = [];

const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...globalBookings]));
};

export const useBookingSystem = (): UseBookingSystemReturn => {
  const [bookings, setBookings] = useState<BookingData[]>([]);

  // Get real bookings from API
  const { data: bookingsData, isLoading, error } = useGetAllBookingsQuery({});

  // Update bookings when API data changes
  useEffect(() => {
    if (bookingsData?.data) {
      // Transform API data to match BookingData interface
      const transformedBookings: BookingData[] = bookingsData.data.map((booking: any) => ({
        id: booking.id,
        customerName: booking.customerName || "",
        customerPhone: booking.customerPhone || "",
        customerType: "existing" as const,
        vehicleModel: "",
        plateNumber: "",
        vehicleType: "سيدان",
        services: booking.services || [],
        branch: booking.branchId || "",
        servicePath: "standard",
        assignedEmployee: "",
        date: booking.date || "",
        time: booking.time || "",
        duration: 30,
        totalPrice: 0,
        bookingType: "app" as const,
        status: booking.status || "confirmed",
        priority: "normal" as const,
        notes: booking.notes || "",
        paymentStatus: "paid" as const,
        reminderSent: false,
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || new Date().toISOString()
      }));
      
      setBookings(transformedBookings);
      globalBookings = transformedBookings;
    }
  }, [bookingsData]);

  // Debug: Log bookings data
  console.log("🔍 useBookingSystem - Bookings:", bookings);
  console.log("🔍 useBookingSystem - Loading:", isLoading);
  console.log("🔍 useBookingSystem - Error:", error);

  const addBooking = useCallback((bookingData: Omit<BookingData, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: BookingData = {
      ...bookingData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    globalBookings = [...globalBookings, newBooking];
    notifySubscribers();
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<BookingData>) => {
    globalBookings = globalBookings.map(booking =>
      booking.id === id 
        ? { ...booking, ...updates, updatedAt: new Date().toISOString() }
        : booking
    );
    notifySubscribers();
  }, []);

  const deleteBooking = useCallback((id: string) => {
    globalBookings = globalBookings.filter(booking => booking.id !== id);
    notifySubscribers();
  }, []);

  const getBookingById = useCallback((id: string) => {
    return globalBookings.find(booking => booking.id === id);
  }, []);

  const getBookingsByDate = useCallback((date: string) => {
    return globalBookings.filter(booking => booking.date === date);
  }, []);

  const getBookingsByBranch = useCallback((branch: string) => {
    return globalBookings.filter(booking => booking.branch === branch);
  }, []);

  const getBookingsByStatus = useCallback((status: BookingData['status']) => {
    return globalBookings.filter(booking => booking.status === status);
  }, []);

  const searchBookings = useCallback((query: string) => {
    const searchTerm = query.toLowerCase();
    return globalBookings.filter(booking =>
      booking.customerName.toLowerCase().includes(searchTerm) ||
      booking.customerPhone.includes(searchTerm) ||
      booking.plateNumber?.toLowerCase().includes(searchTerm) ||
      booking.notes.toLowerCase().includes(searchTerm)
    );
  }, []);

  return {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingById,
    getBookingsByDate,
    getBookingsByBranch,
    getBookingsByStatus,
    searchBookings
  };
};