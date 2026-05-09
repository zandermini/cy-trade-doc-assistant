import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationCompanyProfile } from '../../db/entities/company-profile.entity';

@Injectable()
export class CompanyProfileService extends Repository<QuotationCompanyProfile> {
  constructor(
    @InjectRepository(QuotationCompanyProfile, 'extension_cy_trade_doc_assistant')
    private readonly companyProfileRepository: Repository<QuotationCompanyProfile>,
  ) {
    super(
      companyProfileRepository.target,
      companyProfileRepository.manager,
      companyProfileRepository.queryRunner,
    );
  }

  async getByUser(userId: string): Promise<QuotationCompanyProfile | null> {
    return this.companyProfileRepository.findOne({
      where: { userId },
    });
  }

  async getOrCreate(userId: string): Promise<QuotationCompanyProfile> {
    let profile = await this.getByUser(userId);
    if (!profile) {
      profile = this.companyProfileRepository.create({
        userId,
        companyName: '',
      });
      profile = await this.companyProfileRepository.save(profile);
    }
    return profile;
  }

  async update(userId: string, data: Partial<QuotationCompanyProfile>): Promise<QuotationCompanyProfile> {
    const profile = await this.getOrCreate(userId);
    Object.assign(profile, data);
    return this.companyProfileRepository.save(profile);
  }
}
