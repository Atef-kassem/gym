export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: string;
  customerType: 'Individual' | 'Company' | 'Group';
  notes?: string;
  avatar: string;
  joinDate: string;
  lastVisit?: string; // إضافة هذا الحقل
  totalVisits: number;
  totalSpent: number;
  cars: Car[];
  contacts: Contact[];
  relatedCustomers: RelatedPerson[];
  coupons: Coupon[];
  packages: Package[];
}

export interface Car {
  id: number;
  plate: string;
  make: string;
  model: string;
  year: string;
  color: string;
  fuelType?: string;
  transmission?: string;
  engineSize?: string;
  vehicleType?: string;
  chassisNumber?: string; // رقم الهيكل (الشاصي) - حد أقصى 17 رقم وحرف
  odometerReading?: number; // عداد المسافة
  recommendedOilQuantity?: number; // كمية الزيت الموصى بها
  notes?: string;
}

export interface Contact {
  id: number;
  type: string;
  value: string;
}

export interface RelatedPerson {
  id: number;
  name: string;
  phone: string;
  relation: string;
}

export interface Coupon {
  id: string;
  title: string;
  discount: number;
  expiryDate: string;
  isUsed: boolean;
}

export interface Package {
  id: string;
  name: string;
  services: string[];
  remainingServices: number;
  expiryDate: string;
}

export interface CustomerFormData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  birthDate?: string;
  customerType: 'Individual' | 'Company' | 'Group';
  notes?: string;
  avatar?: string;
  cars: Car[];
  contacts: Contact[];
  relatedCustomers: RelatedPerson[];
}