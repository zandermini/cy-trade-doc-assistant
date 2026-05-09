import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsService } from './services/settings.service';
import { SettingsAdminController } from './controllers/admin/settings.controller';
import { QuotationSettings } from '../../db/entities/settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationSettings], 'extension_cy_trade_doc_assistant')],
  controllers: [SettingsAdminController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
