import { BaseEntity } from '@buildingai/db';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface QuotationItem {
  productId: string;
  userCode: string;
  nameZh: string;
  nameEn: string;
  specification: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  hsCode?: string;
}

export interface CustomerSnapshot {
  id?: string;
  companyName: string;
  companyNameEn?: string;
  country: string;
  address?: string;
  addressEn?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
}

@Entity('quotations', { schema: 'cy_trade_doc_assistant' })
export class Quotation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'quotation_no', length: 50 })
  quotationNo: string;

  @Column({ length: 20 })
  type: string;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ name: 'customer_snapshot', type: 'jsonb', nullable: true })
  customerSnapshot: CustomerSnapshot;

  @Column({ type: 'jsonb' })
  items: QuotationItem[];

  @Column({ name: 'subtotal', type: 'decimal', precision: 12, scale: 2 })
  subtotal: number;

  @Column({ length: 10, default: 'USD' })
  currency: string;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date;

  @Column({ name: 'payment_terms', type: 'text', nullable: true })
  paymentTerms: string;

  @Column({ name: 'shipping_terms', type: 'text', nullable: true })
  shippingTerms: string;

  @Column({ name: 'delivery_time', type: 'text', nullable: true })
  deliveryTime: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'template_id', nullable: true })
  templateId: string;

  @Column({ length: 20, default: 'draft' })
  status: string;

  @Column({ name: 'power_cost', default: 0 })
  powerCost: number;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
