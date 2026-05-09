import { BaseController } from '@buildingai/base';
import { Controller, Get, Put, Body, Query } from '@nestjs/common';
import { CompanyProfileService } from './services/company-profile.service';

@Controller('web/cy-trade-doc-assistant/company-profile')
export class CompanyProfileWebController extends BaseController {
  constructor(private readonly companyProfileService: CompanyProfileService) {
    super();
  }

  @Get()
  async get(@Query('userId') userId: string) {
    const profile = await this.companyProfileService.getOrCreate(userId);
    return this.response(profile);
  }

  @Put()
  async update(@Body() dto: any) {
    const profile = await this.companyProfileService.update(dto.userId, dto);
    return this.response(profile);
  }
}
