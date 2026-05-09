import { BaseController } from '@buildingai/base';
import { Controller, Get, Query } from '@nestjs/common';
import { ConversationService } from './services/conversation.service';

@Controller('admin/plugin/cy-trade-doc-assistant/users')
export class UsersAdminController extends BaseController {
  constructor(private readonly conversationService: ConversationService) {
    super();
  }

  @Get('conversations')
  async getConversations(@Query('page') page?: number, @Query('pageSize') pageSize?: number) {
    const result = await this.conversationService.findAllAdmin(page || 1, pageSize || 15);
    return this.paginationResult(result.items, result.total, { page: page || 1, pageSize: pageSize || 15 });
  }

  @Get('stats')
  async getStats(@Query('userId') userId: string) {
    const stats = await this.conversationService.getUserPowerCostStats(userId);
    return this.response(stats);
  }
}
