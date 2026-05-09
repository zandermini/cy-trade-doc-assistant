import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './services/customer.service';
import { CustomerWebController } from './controllers/web/customer.controller';
import { QuotationCustomer } from '../../db/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationCustomer], 'extension_cy_trade_doc_assistant')],
  controllers: [CustomerWebController],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
