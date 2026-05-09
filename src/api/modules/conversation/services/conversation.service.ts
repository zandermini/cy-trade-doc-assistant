import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationConversation } from '../../db/entities/conversation.entity';

@Injectable()
export class ConversationService extends Repository<QuotationConversation> {
  constructor(
    @InjectRepository(QuotationConversation, 'extension_cy_trade_doc_assistant')
    private readonly conversationRepository: Repository<QuotationConversation>,
  ) {
    super(
      conversationRepository.target,
      conversationRepository.manager,
      conversationRepository.queryRunner,
    );
  }

  async findByUser(userId: string, page = 1, pageSize = 15): Promise<{ items: QuotationConversation[]; total: number }> {
    const [items, total] = await this.conversationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total };
  }

  async findAllAdmin(page = 1, pageSize = 15): Promise<{ items: QuotationConversation[]; total: number }> {
    const [items, total] = await this.conversationRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total };
  }

  async create(data: Partial<QuotationConversation>): Promise<QuotationConversation> {
    const conversation = this.conversationRepository.create(data);
    return this.conversationRepository.save(conversation);
  }

  async getUserPowerCostStats(userId: string): Promise<{ totalPowerCost: number; conversationCount: number }> {
    const result = await this.conversationRepository
      .createQueryBuilder('conversation')
      .select('COUNT(*)', 'conversationCount')
      .addSelect('COALESCE(SUM(conversation.powerCost), 0)', 'totalPowerCost')
      .where('conversation.userId = :userId', { userId })
      .getRawOne();

    return {
      conversationCount: parseInt(result.conversationCount) || 0,
      totalPowerCost: parseInt(result.totalPowerCost) || 0,
    };
  }
}
