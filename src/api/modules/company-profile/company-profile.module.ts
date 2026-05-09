import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyProfileService } from './services/company-profile.service';
import { CompanyProfileWebController } from './controllers/web/company-profile.controller';
import { QuotationCompanyProfile } from '../../db/entities/company-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationCompanyProfile], 'extension_cy_trade_doc_assistant')],
  controllers: [CompanyProfileWebController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
