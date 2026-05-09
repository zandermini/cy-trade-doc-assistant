import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationSettings } from '../../db/entities/settings.entity';

@Injectable()
export class SettingsService extends Repository<QuotationSettings> {
  constructor(
    @InjectRepository(QuotationSettings, 'extension_cy_trade_doc_assistant')
    private readonly settingsRepository: Repository<QuotationSettings>,
  ) {
    super(
      settingsRepository.target,
      settingsRepository.manager,
      settingsRepository.queryRunner,
    );
  }

  async getSettings(): Promise<QuotationSettings | null> {
    return this.settingsRepository.findOne({});
  }

  async getOrCreate(): Promise<QuotationSettings> {
    let settings = await this.getSettings();
    if (!settings) {
      settings = this.settingsRepository.create({
        billingPerGeneration: 10,
        billingPerQuery: 1,
      });
      settings = await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async updateSettings(data: Partial<QuotationSettings>): Promise<QuotationSettings> {
    const settings = await this.getOrCreate();
    Object.assign(settings, data);
    return this.settingsRepository.save(settings);
  }

  async getBillingConfig(): Promise<{ billingPerGeneration: number; billingPerQuery: number }> {
    const settings = await this.getOrCreate();
    return {
      billingPerGeneration: settings.billingPerGeneration,
      billingPerQuery: settings.billingPerQuery,
    };
  }

  async getDeepseekApiKey(): Promise<string | null> {
    const settings = await this.getOrCreate();
    return settings.deepseekApiKey;
  }
}
