import { requester } from '@buildingai/extension-sdk';

export interface Product {
  id: string;
  userId: string;
  userCode: string;
  nameZh: string;
  nameEn?: string;
  specification?: string;
  unit: string;
  unitPrice: number;
  moq: number;
  hsCode?: string;
  category?: string;
  notes?: string;
  imageUrl?: string;
  packagingSpec?: string;
  grossWeight?: number;
  netWeight?: number;
  origin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  userId: string;
  userCode: string;
  nameZh: string;
  nameEn?: string;
  specification?: string;
  unit: string;
  unitPrice: number;
  moq?: number;
  hsCode?: string;
  category?: string;
  notes?: string;
}

const productApi = requester('/api/web/cy-trade-doc-assistant/products');

export const ProductService = {
  list: (userId: string): Promise<Product[]> => {
    return productApi.get('/', { params: { userId } }).then((res) => res.data);
  },

  search: (userId: string, keyword: string): Promise<Product[]> => {
    return productApi.get('/search', { params: { userId, keyword } }).then((res) => res.data);
  },

  get: (userId: string, id: string): Promise<Product> => {
    return productApi.get(`/${id}`, { params: { userId } }).then((res) => res.data);
  },

  create: (data: CreateProductDto): Promise<Product> => {
    return productApi.post('/', data).then((res) => res.data);
  },

  update: (id: string, userId: string, data: Partial<Product>): Promise<Product> => {
    return productApi.put(`/${id}`, { ...data, userId }).then((res) => res.data);
  },

  delete: (id: string, userId: string): Promise<void> => {
    return productApi.delete(`/${id}`, { params: { userId } }).then((res) => res.data);
  },

  batchImport: (userId: string, products: Partial<Product>[]): Promise<Product[]> => {
    return productApi.post('/batch-import', { userId, products }).then((res) => res.data);
  },
};
