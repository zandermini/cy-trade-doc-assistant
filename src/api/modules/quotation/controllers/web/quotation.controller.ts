import { BaseController } from '@buildingai/base';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { QuotationService } from './services/quotation.service';

@Controller('web/cy-trade-doc-assistant/quotations')
export class QuotationWebController extends BaseController {
  constructor(private readonly quotationService: QuotationService) {
    super();
  }

  @Get()
  async list(@Query('userId') userId: string, @Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    const result = await this.quotationService.findByUser(userId, page || 1, pageSize || 15);
    return this.paginationResult(result.items, result.total, { page: page || 1, pageSize: pageSize || 15 });
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Query('userId') userId: string) {
    const quotation = await this.quotationService.findById(id, userId);
    return this.response(quotation);
  }

  @Post()
  async create(@Body() dto: any) {
    const quotationNo = await this.quotationService.generateQuotationNo(dto.userId);
    const quotation = await this.quotationService.create({
      ...dto,
      quotationNo,
    });
    return this.response(quotation);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const quotation = await this.quotationService.update(id, dto.userId, dto);
    return this.response(quotation);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    await this.quotationService.softDelete(id, userId);
    return this.response(null);
  }

  @Post(':id/duplicate')
  async duplicate(@Param('id') id: string, @Query('userId') userId: string) {
    const quotation = await this.quotationService.duplicate(id, userId);
    return this.response(quotation);
  }

  @Get('user/stats')
  async getUserStats(@Query('userId') userId: string) {
    const stats = await this.quotationService.getUserStats(userId);
    return this.response(stats);
  }
}
