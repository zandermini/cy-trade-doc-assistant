import { BaseController } from '@buildingai/base';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TemplateService } from './services/template.service';

@Controller('admin/plugin/cy-trade-doc-assistant/templates')
export class TemplateAdminController extends BaseController {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  @Get()
  async list(@Query('userId') userId?: string) {
    const items = await this.templateService.findAll(userId);
    return this.response(items, items.length);
  }

  @Post('init')
  async initSystemTemplates() {
    await this.templateService.initSystemTemplates();
    return this.response({ success: true });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const template = await this.templateService.findOne({ where: { id } });
    return this.response(template);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const template = await this.templateService.update(id, dto);
    return this.response(template);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.templateService.softDelete(id);
    return this.response(null);
  }
}
