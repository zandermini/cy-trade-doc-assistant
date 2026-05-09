import { BaseController } from '@buildingai/base';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { CustomerService } from './services/customer.service';

@Controller('web/cy-trade-doc-assistant/customers')
export class CustomerWebController extends BaseController {
  constructor(private readonly customerService: CustomerService) {
    super();
  }

  @Get()
  async list(@Query('userId') userId: string) {
    const items = await this.customerService.findByUser(userId);
    return this.response(items, items.length);
  }

  @Get('search')
  async search(@Query('userId') userId: string, @Query('keyword') keyword: string) {
    const items = await this.customerService.searchCustomers(userId, keyword);
    return this.response(items, items.length);
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Query('userId') userId: string) {
    const items = await this.customerService.findByUser(userId);
    const customer = items.find((c) => c.id === id);
    return this.response(customer);
  }

  @Post()
  async create(@Body() dto: any) {
    const customer = await this.customerService.create(dto);
    return this.response(customer);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const customer = await this.customerService.update(id, dto.userId, dto);
    return this.response(customer);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    await this.customerService.softDelete(id, userId);
    return this.response(null);
  }
}
