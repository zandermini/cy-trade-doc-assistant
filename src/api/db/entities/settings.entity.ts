import { BaseEntity } from '@buildingai/db';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotation_settings', { schema: 'cy_trade_doc_assistant' })
export class QuotationSettings extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'billing_per_generation', default: 10 })
  billingPerGeneration: number;

  @Column({ name: 'billing_per_query', default: 1 })
  billingPerQuery: number;

  @UpdateDateColumn()
  updatedAt: Date;
}
