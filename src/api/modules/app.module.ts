import { Module } from '@nestjs/common';

import { ProductModule } from './product/product.module';
import { CustomerModule } from './customer/customer.module';
import { TemplateModule } from './template/template.module';
import { QuotationModule } from './quotation/quotation.module';
import { ConversationModule } from './conversation/conversation.module';
import { SettingsModule } from './settings/settings.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [
    ProductModule,
    CustomerModule,
    TemplateModule,
    QuotationModule,
    ConversationModule,
    SettingsModule,
    CompanyProfileModule,
    GenerateModule,
  ],
  exports: [
    ProductModule,
    CustomerModule,
    TemplateModule,
    QuotationModule,
    ConversationModule,
    SettingsModule,
    CompanyProfileModule,
  ],
})
export class AppModule {}
