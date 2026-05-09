import { BaseController } from '@buildingai/base';
import { Controller, Get, Put, Body } from '@nestjs/common';
import { SettingsService } from './services/settings.service';

@Controller('admin/plugin/cy-trade-doc-assistant/settings')
export class SettingsAdminController extends BaseController {
  constructor(private readonly settingsService: SettingsService) {
    super();
  }

  @Get()
  async get() {
    const settings = await this.settingsService.getOrCreate();
    return this.response(settings);
  }

  @Put()
  async update(@Body() dto: any) {
    const settings = await this.settingsService.updateSettings(dto);
    return this.response(settings);
  }

  @Get('billing')
  async getBilling() {
    const billing = await this.settingsService.getBillingConfig();
    return this.response(billing);
  }

  @Get('api-key-status')
  async getApiKeyStatus() {
    const apiKey = await this.settingsService.getDeepseekApiKey();
    return this.response({
      configured: !!apiKey && apiKey.length > 0,
      masked: apiKey ? this.maskApiKey(apiKey) : null,
    });
  }

  private maskApiKey(apiKey: string): string {
    if (apiKey.length <= 8) {
      return '****';
    }
    return apiKey.substring(0, 4) + '****' + apiKey.substring(apiKey.length - 4);
  }
}
