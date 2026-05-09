import { BaseController } from '@buildingai/base';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { TemplateService } from './services/template.service';

@Controller('web/cy-trade-doc-assistant/templates')
export class TemplateWebController extends BaseController {
  constructor(private readonly templateService: TemplateService) {
    super();
  }

  @Get()
  async list(@Query('userId') userId: string) {
    const items = await this.templateService.findAll(userId);
    return this.response(items, items.length);
  }

  @Get('type/:type')
  async listByType(@Param('type') type: string, @Query('userId') userId: string) {
    const items = await this.templateService.findByType(type, userId);
    return this.response(items, items.length);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const template = await this.templateService.findOne({ where: { id } });
    return this.response(template);
  }

  @Post()
  async create(@Body() dto: any) {
    const template = await this.templateService.create(dto);
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
