import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationService } from './services/conversation.service';
import { UsersAdminController } from './controllers/admin/users.controller';
import { QuotationConversation } from '../../db/entities/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuotationConversation], 'extension_cy_trade_doc_assistant')],
  controllers: [UsersAdminController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
