import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { AiModule } from '../ai/ai.module';
import { SettingsModule } from '../settings/settings.module';
import { QuotationModule } from '../quotation/quotation.module';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [AiModule, SettingsModule, QuotationModule, ConversationModule],
  controllers: [GenerateController],
})
export class GenerateModule {}
