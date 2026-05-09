import { requester } from '@buildingai/extension-sdk';

export interface Template {
  id: string;
  name: string;
  type: 'PI' | 'CI' | 'PLI' | 'SC';
  description?: string;
  content: {
    header: object;
    footer: object;
    styles: object;
  };
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateDto {
  name: string;
  type: 'PI' | 'CI' | 'PLI' | 'SC';
  description?: string;
  content?: {
    header: object;
    footer: object;
    styles: object;
  };
  isSystem?: boolean;
}

const templateApi = requester('/api/web/cy-trade-doc-assistant/templates');

export const TemplateService = {
  list: (userId?: string): Promise<Template[]> => {
    return templateApi.get('/', { params: { userId } }).then((res) => res.data);
  },

  listByType: (type: string, userId?: string): Promise<Template[]> => {
    return templateApi.get(`/type/${type}`, { params: { userId } }).then((res) => res.data);
  },

  get: (id: string): Promise<Template> => {
    return templateApi.get(`/${id}`).then((res) => res.data);
  },

  create: (data: CreateTemplateDto): Promise<Template> => {
    return templateApi.post('/', data).then((res) => res.data);
  },

  update: (id: string, data: Partial<Template>): Promise<Template> => {
    return templateApi.put(`/${id}`, data).then((res) => res.data);
  },

  delete: (id: string): Promise<void> => {
    return templateApi.delete(`/${id}`).then((res) => res.data);
  },
};
