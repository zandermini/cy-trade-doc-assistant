import { BaseEntity } from '@buildingai/db';
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('quotation_company_profile', { schema: 'cy_trade_doc_assistant' })
export class QuotationCompanyProfile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @Column({ name: 'company_name', length: 255 })
  companyName: string;

  @Column({ name: 'company_name_en', length: 255, nullable: true })
  companyNameEn: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'address_en', type: 'text', nullable: true })
  addressEn: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  website: string;

  @Column({ name: 'bank_name', length: 255, nullable: true })
  bankName: string;

  @Column({ name: 'bank_account', length: 255, nullable: true })
  bankAccount: string;

  @Column({ name: 'swift_code', length: 20, nullable: true })
  swiftCode: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
