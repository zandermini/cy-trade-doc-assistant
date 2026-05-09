import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { ProductWebController } from './controllers/web/product.controller';
import { QuotationProduct } from '../../db/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationProduct], 'extension_cy_trade_doc_assistant')],
  controllers: [ProductWebController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
