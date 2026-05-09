import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation } from '../../db/entities/quotation.entity';

@Injectable()
export class QuotationService extends Repository<Quotation> {
  constructor(
    @InjectRepository(Quotation, 'extension_cy_trade_doc_assistant')
    private readonly quotationRepository: Repository<Quotation>,
  ) {
    super(
      quotationRepository.target,
      quotationRepository.manager,
      quotationRepository.queryRunner,
    );
  }

  async findByUser(userId: string, page = 1, pageSize = 15): Promise<{ items: Quotation[]; total: number }> {
    const [items, total] = await this.quotationRepository.findAndCount({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total };
  }

  async findById(id: string, userId: string): Promise<Quotation | null> {
    return this.quotationRepository.findOne({
      where: { id, userId, isDeleted: false },
    });
  }

  async generateQuotationNo(userId: string): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    const count = await this.quotationRepository
      .createQueryBuilder('quotation')
      .where('quotation.userId = :userId', { userId })
      .andWhere('quotation.quotationNo LIKE :prefix', { prefix: `QUO-${dateStr}-%` })
      .getCount();

    const sequence = String(count + 1).padStart(3, '0');
    return `QUO-${dateStr}-${sequence}`;
  }

  async create(data: Partial<Quotation>): Promise<Quotation> {
    const quotation = this.quotationRepository.create(data);
    return this.quotationRepository.save(quotation);
  }

  async update(id: string, userId: string, data: Partial<Quotation>): Promise<Quotation | null> {
    await this.quotationRepository.update({ id, userId }, data);
    return this.findById(id, userId);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.quotationRepository.update({ id, userId }, { isDeleted: true });
  }

  async duplicate(id: string, userId: string): Promise<Quotation | null> {
    const original = await this.findById(id, userId);
    if (!original) return null;

    const newQuotationNo = await this.generateQuotationNo(userId);
    
    const duplicated = this.quotationRepository.create({
      ...original,
      id: undefined,
      quotationNo: newQuotationNo,
      status: 'draft',
      createdAt: undefined,
      updatedAt: undefined,
    });

    return this.quotationRepository.save(duplicated);
  }

  async getUserStats(userId: string): Promise<{ totalQuotations: number; totalPowerCost: number }> {
    const result = await this.quotationRepository
      .createQueryBuilder('quotation')
      .select('COUNT(*)', 'totalQuotations')
      .addSelect('COALESCE(SUM(quotation.powerCost), 0)', 'totalPowerCost')
      .where('quotation.userId = :userId', { userId })
      .andWhere('quotation.isDeleted = :isDeleted', { isDeleted: false })
      .getRawOne();

    return {
      totalQuotations: parseInt(result.totalQuotations) || 0,
      totalPowerCost: parseInt(result.totalPowerCost) || 0,
    };
  }
}
