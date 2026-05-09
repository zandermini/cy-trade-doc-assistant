import { BaseEntity } from '@buildingai/db';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotation_customers', { schema: 'cy_trade_doc_assistant' })
export class QuotationCustomer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ length: 100, nullable: true })
  customerCode: string;

  @Column({ length: 255 })
  companyName: string;

  @Column({ name: 'company_name_en', length: 255, nullable: true })
  companyNameEn: string;

  @Column({ length: 100 })
  country: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'address_en', type: 'text', nullable: true })
  addressEn: string;

  @Column({ name: 'contact_person', length: 100, nullable: true })
  contactPerson: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'is_deleted', default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
