import { BaseEntity } from '@buildingai/db';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotation_products', { schema: 'cy_trade_doc_assistant' })
export class QuotationProduct extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'user_code', length: 50 })
  userCode: string;

  @Column({ name: 'name_zh', length: 255 })
  nameZh: string;

  @Column({ name: 'name_en', length: 255, nullable: true })
  nameEn: string;

  @Column({ length: 255, nullable: true })
  specification: string;

  @Column({ length: 50 })
  unit: string;

  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 })
  unitPrice: number;

  @Column({ name: 'moq', default: 1 })
  moq: number;

  @Column({ name: 'hs_code', length: 20, nullable: true })
  hsCode: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column({ name: 'packaging_spec', length: 255, nullable: true })
  packagingSpec: string;

  @Column({ name: 'gross_weight', type: 'decimal', precision: 10, scale: 2, nullable: true })
  grossWeight: number;

  @Column({ name: 'net_weight', type: 'decimal', precision: 10, scale: 2, nullable: true })
  netWeight: number;

  @Column({ length: 100, nullable: true })
  origin: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
