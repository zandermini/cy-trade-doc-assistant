import { BaseController } from '@buildingai/base';
import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './services/product.service';

@Controller('web/cy-trade-doc-assistant/products')
export class ProductWebController extends BaseController {
  constructor(private readonly productService: ProductService) {
    super();
  }

  @Get()
  async list(@Query('userId') userId: string) {
    const items = await this.productService.findByUser(userId);
    return this.response(items, items.length);
  }

  @Get('search')
  async search(@Query('userId') userId: string, @Query('keyword') keyword: string) {
    const items = await this.productService.searchProducts(userId, keyword);
    return this.response(items, items.length);
  }

  @Get(':id')
  async detail(@Param('id') id: string, @Query('userId') userId: string) {
    const items = await this.productService.findByUser(userId);
    const product = items.find((p) => p.id === id);
    return this.response(product);
  }

  @Post()
  async create(@Body() dto: any) {
    const product = await this.productService.create(dto);
    return this.response(product);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: any) {
    const product = await this.productService.update(id, dto.userId, dto);
    return this.response(product);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Query('userId') userId: string) {
    await this.productService.softDelete(id, userId);
    return this.response(null);
  }

  @Post('batch-import')
  async batchImport(@Body() dto: { userId: string; products: any[] }) {
    const products = await this.productService.batchImport(dto.userId, dto.products);
    return this.response(products, products.length);
  }
}
