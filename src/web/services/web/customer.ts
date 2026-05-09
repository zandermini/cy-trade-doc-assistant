import { requester } from '@buildingai/extension-sdk';

export interface Customer {
  id: string;
  userId: string;
  customerCode?: string;
  companyName: string;
  companyNameEn?: string;
  country: string;
  address?: string;
  addressEn?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  userId: string;
  customerCode?: string;
  companyName: string;
  companyNameEn?: string;
  country: string;
  address?: string;
  addressEn?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

const customerApi = requester('/api/web/cy-trade-doc-assistant/customers');

export const CustomerService = {
  list: (userId: string): Promise<Customer[]> => {
    return customerApi.get('/', { params: { userId } }).then((res) => res.data);
  },

  search: (userId: string, keyword: string): Promise<Customer[]> => {
    return customerApi.get('/search', { params: { userId, keyword } }).then((res) => res.data);
  },

  get: (userId: string, id: string): Promise<Customer> => {
    return customerApi.get(`/${id}`, { params: { userId } }).then((res) => res.data);
  },

  create: (data: CreateCustomerDto): Promise<Customer> => {
    return customerApi.post('/', data).then((res) => res.data);
  },

  update: (id: string, userId: string, data: Partial<Customer>): Promise<Customer> => {
    return customerApi.put(`/${id}`, { ...data, userId }).then((res) => res.data);
  },

  delete: (id: string, userId: string): Promise<void> => {
    return customerApi.delete(`/${id}`, { params: { userId } }).then((res) => res.data);
  },
};
