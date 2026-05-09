import { requester } from '@buildingai/extension-sdk';

export interface QuotationItem {
  productId: string;
  userCode: string;
  nameZh: string;
  nameEn?: string;
  specification?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  hsCode?: string;
}

export interface CustomerSnapshot {
  id?: string;
  companyName: string;
  companyNameEn?: string;
  country: string;
  address?: string;
  addressEn?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
}

export interface Quotation {
  id: string;
  userId: string;
  quotationNo: string;
  type: 'PI' | 'CI' | 'PLI' | 'SC';
  customerId?: string;
  customerSnapshot?: CustomerSnapshot;
  items: QuotationItem[];
  subtotal: number;
  currency: string;
  validUntil?: string;
  paymentTerms?: string;
  shippingTerms?: string;
  deliveryTime?: string;
  notes?: string;
  templateId?: string;
  status: 'draft' | 'confirmed' | 'sent';
  powerCost: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuotationDto {
  userId: string;
  type: 'PI' | 'CI' | 'PLI' | 'SC';
  customerId?: string;
  customerSnapshot?: CustomerSnapshot;
  items: QuotationItem[];
  subtotal: number;
  currency?: string;
  validUntil?: string;
  paymentTerms?: string;
  shippingTerms?: string;
  deliveryTime?: string;
  notes?: string;
  templateId?: string;
  status?: 'draft' | 'confirmed' | 'sent';
}

const quotationApi = requester('/api/web/cy-trade-doc-assistant/quotations');

export const QuotationService = {
  list: (userId: string, page = 1, pageSize = 15): Promise<{ items: Quotation[]; total: number }> => {
    return quotationApi.get('/', { params: { userId, page, pageSize } }).then((res) => res.data);
  },

  get: (userId: string, id: string): Promise<Quotation> => {
    return quotationApi.get(`/${id}`, { params: { userId } }).then((res) => res.data);
  },

  create: (data: CreateQuotationDto): Promise<Quotation> => {
    return quotationApi.post('/', data).then((res) => res.data);
  },

  update: (id: string, userId: string, data: Partial<Quotation>): Promise<Quotation> => {
    return quotationApi.put(`/${id}`, { ...data, userId }).then((res) => res.data);
  },

  delete: (id: string, userId: string): Promise<void> => {
    return quotationApi.delete(`/${id}`, { params: { userId } }).then((res) => res.data);
  },

  duplicate: (id: string, userId: string): Promise<Quotation> => {
    return quotationApi.post(`/${id}/duplicate`, null, { params: { userId } }).then((res) => res.data);
  },

  getUserStats: (userId: string): Promise<{ totalQuotations: number; totalPowerCost: number }> => {
    return quotationApi.get('/user/stats', { params: { userId } }).then((res) => res.data);
  },
};
