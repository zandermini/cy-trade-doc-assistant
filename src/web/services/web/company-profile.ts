import { requester } from '@buildingai/extension-sdk';

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  companyNameEn?: string;
  address?: string;
  addressEn?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  bankName?: string;
  bankAccount?: string;
  swiftCode?: string;
  logoUrl?: string;
  updatedAt: string;
}

export interface UpdateCompanyProfileDto {
  userId: string;
  companyName: string;
  companyNameEn?: string;
  address?: string;
  addressEn?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  bankName?: string;
  bankAccount?: string;
  swiftCode?: string;
  logoUrl?: string;
}

const companyProfileApi = requester('/api/web/cy-trade-doc-assistant/company-profile');

export const CompanyProfileService = {
  get: (userId: string): Promise<CompanyProfile> => {
    return companyProfileApi.get('/', { params: { userId } }).then((res) => res.data);
  },

  update: (data: UpdateCompanyProfileDto): Promise<CompanyProfile> => {
    return companyProfileApi.put('/', data).then((res) => res.data);
  },
};
