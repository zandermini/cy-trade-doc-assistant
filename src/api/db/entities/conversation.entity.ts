import { BaseEntity } from '@buildingai/db';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('quotation_conversations', { schema: 'cy_trade_doc_assistant' })
export class QuotationConversation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_message', type: 'text' })
  userMessage: string;

  @Column({ name: 'ai_response', type: 'text', nullable: true })
  aiResponse: string;

  @Column({ name: 'quotation_id', nullable: true })
  quotationId: string;

  @Column({ name: 'operation_type', length: 20 })
  operationType: string;

  @Column({ name: 'power_cost', default: 0 })
  powerCost: number;

  @CreateDateColumn()
  createdAt: Date;
}
