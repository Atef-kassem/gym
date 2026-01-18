import { useState, useCallback, useEffect } from 'react';
import { Customer, CustomerFormData } from '@/types/customer';
import { 
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from '@/services/customersApi';

let localCustomers: Customer[] = [];

export function useCustomerStore() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { data: customersResponse } = useGetCustomersQuery({ limit: 500 });
  const [createCustomer] = useCreateCustomerMutation();
  const [updateCustomerApi] = useUpdateCustomerMutation();

  useEffect(() => {
    if (customersResponse?.data) {
      setCustomers(customersResponse.data as Customer[]);
    }
  }, [customersResponse]);

  const addCustomer = useCallback((customerData: CustomerFormData): Customer => {
    const optimistic: Customer = {
      id: `temp_${Date.now()}`,
      ...customerData,
      avatar: customerData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      joinDate: new Date().toISOString(),
      totalVisits: 0,
      totalSpent: 0,
      coupons: [],
      packages: [],
    };
    setCustomers((prev) => [optimistic, ...prev]);
    (async () => {
      try {
        const res: any = await createCustomer({ ...customerData }).unwrap();
        const created = res?.data as Customer;
        setCustomers((prev) => [created, ...prev.filter((c) => c.id !== optimistic.id)]);
        window.dispatchEvent(new CustomEvent('customerAdded', { detail: created }));
      } catch (e) {
        // rollback
        setCustomers((prev) => prev.filter((c) => c.id !== optimistic.id));
        console.error('Failed to create customer', e);
      }
    })();
    return optimistic;
  }, [createCustomer]);

  const updateCustomer = useCallback((customerId: string, customerData: Partial<Customer>): Customer | null => {
    const previous = customers;
    const patched: Customer[] = customers.map((c) => (c.id === customerId ? { ...c, ...customerData } : c));
    setCustomers(patched);
    (async () => {
      try {
        await updateCustomerApi({ id: customerId, ...customerData }).unwrap();
        const updated = patched.find((c) => c.id === customerId);
        if (updated) window.dispatchEvent(new CustomEvent('customerUpdated', { detail: updated }));
      } catch (e) {
        setCustomers(previous);
        console.error('Failed to update customer', e);
      }
    })();
    return patched.find((c) => c.id === customerId) || null;
  }, [customers, updateCustomerApi]);

  // البحث عن عميل
  const searchCustomer = useCallback((query: string): Customer[] => {
    if (!query.trim()) return customers;
    
    const lowercaseQuery = query.toLowerCase();
    return customers.filter(customer => 
      customer.name.toLowerCase().includes(lowercaseQuery) ||
      customer.phone.includes(query) ||
      customer.email?.toLowerCase().includes(lowercaseQuery) ||
      customer.cars.some(car => 
        car.plate.toLowerCase().includes(lowercaseQuery) ||
        car.make.toLowerCase().includes(lowercaseQuery) ||
        car.model.toLowerCase().includes(lowercaseQuery)
      )
    );
  }, [customers]);

  const getCustomerById = useCallback((customerId: string): Customer | null => {
    return customers.find(customer => customer.id === customerId) || null;
  }, [customers]);

  const getCustomerByPhone = useCallback((phone: string): Customer | null => {
    return customers.find(customer => customer.phone === phone) || null;
  }, [customers]);

  const getCustomerByPlate = useCallback((plate: string): Customer | null => {
    return customers.find(customer => 
      customer.cars.some(car => car.plate === plate)
    ) || null;
  }, [customers]);

  const getCustomersStats = useCallback(() => {
    const totalCustomers = customers.length;
    const individualCustomers = customers.filter(c => c.customerType === 'Individual').length;
    const companyCustomers = customers.filter(c => c.customerType === 'Company').length;
    const groupCustomers = customers.filter(c => c.customerType === 'Group').length;
    
    return {
      total: totalCustomers,
      individual: individualCustomers,
      company: companyCustomers,
      group: groupCustomers
    };
  }, [customers]);

  const refreshCustomers = useCallback(() => {
    // rely on RTK Query cache invalidation via mutations
    setCustomers((prev) => [...prev]);
  }, []);

  return {
    customers,
    addCustomer,
    updateCustomer,
    searchCustomer,
    getCustomerById,
    getCustomerByPhone,
    getCustomerByPlate,
    getCustomersStats,
    refreshCustomers
  };
}