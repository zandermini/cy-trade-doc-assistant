import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationCustomer } from '../../db/entities/customer.entity';

@Injectable()
export class CustomerService extends Repository<QuotationCustomer> {
  constructor(
    @InjectRepository(QuotationCustomer, 'extension_cy_trade_doc_assistant')
    private readonly customerRepository: Repository<QuotationCustomer>,
  ) {
    super(
      customerRepository.target,
      customerRepository.manager,
      customerRepository.queryRunner,
    );
  }

  async findByUser(userId: string): Promise<QuotationCustomer[]> {
    return this.customerRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async searchCustomers(userId: string, keyword: string): Promise<QuotationCustomer[]> {
    const query = this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.userId = :userId', { userId })
      .andWhere('customer.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere(
        '(customer.companyName LIKE :keyword OR customer.companyNameEn LIKE :keyword OR customer.country LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
      .orderBy('customer.createdAt', 'DESC');

    return query.getMany();
  }

  async findByCompanyName(userId: string, companyName: string): Promise<QuotationCustomer | null> {
    return this.customerRepository
      .createQueryBuilder('customer')
      .where('customer.userId = :userId', { userId })
      .andWhere('customer.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere(
        '(customer.companyName LIKE :companyName OR customer.companyNameEn LIKE :companyName)',
        { companyName: `%${companyName}%` },
      )
      .getOne();
  }

  async create(data: Partial<QuotationCustomer>): Promise<QuotationCustomer> {
    const customer = this.customerRepository.create(data);
    return this.customerRepository.save(customer);
  }

  async update(id: string, userId: string, data: Partial<QuotationCustomer>): Promise<QuotationCustomer | null> {
    await this.customerRepository.update({ id, userId }, data);
    return this.findOne({ where: { id, userId } });
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.customerRepository.update({ id, userId }, { isDeleted: true });
  }
}
