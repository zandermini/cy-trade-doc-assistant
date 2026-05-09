import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuotationService } from './services/quotation.service';
import { QuotationWebController } from './controllers/web/quotation.controller';
import { Quotation } from '../../db/entities/quotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation], 'extension_cy_trade_doc_assistant')],
  controllers: [QuotationWebController],
  providers: [QuotationService],
  exports: [QuotationService],
})
export class QuotationModule {}
