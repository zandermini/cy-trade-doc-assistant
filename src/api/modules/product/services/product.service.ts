import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationProduct } from '../../db/entities/product.entity';

@Injectable()
export class ProductService extends Repository<QuotationProduct> {
  constructor(
    @InjectRepository(QuotationProduct, 'extension_cy_trade_doc_assistant')
    private readonly productRepository: Repository<QuotationProduct>,
  ) {
    super(
      productRepository.target,
      productRepository.manager,
      productRepository.queryRunner,
    );
  }

  async findByUser(userId: string): Promise<QuotationProduct[]> {
    return this.productRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserCode(userId: string, userCode: string): Promise<QuotationProduct | null> {
    return this.productRepository.findOne({
      where: { userId, userCode, isDeleted: false },
    });
  }

  async searchProducts(userId: string, keyword: string): Promise<QuotationProduct[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.userId = :userId', { userId })
      .andWhere('product.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere(
        '(product.userCode LIKE :keyword OR product.nameZh LIKE :keyword OR product.nameEn LIKE :keyword)',
        { keyword: `%${keyword}%` },
      )
      .orderBy('product.createdAt', 'DESC');

    return query.getMany();
  }

  async findByIds(userId: string, ids: string[]): Promise<QuotationProduct[]> {
    if (ids.length === 0) return [];
    return this.productRepository
      .createQueryBuilder('product')
      .where('product.userId = :userId', { userId })
      .andWhere('product.id IN (:...ids)', { ids })
      .andWhere('product.isDeleted = :isDeleted', { isDeleted: false })
      .getMany();
  }

  async create(data: Partial<QuotationProduct>): Promise<QuotationProduct> {
    const product = this.productRepository.create(data);
    return this.productRepository.save(product);
  }

  async update(id: string, userId: string, data: Partial<QuotationProduct>): Promise<QuotationProduct | null> {
    await this.productRepository.update({ id, userId }, data);
    return this.findOne({ where: { id, userId } });
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.productRepository.update({ id, userId }, { isDeleted: true });
  }

  async batchImport(userId: string, products: Partial<QuotationProduct>[]): Promise<QuotationProduct[]> {
    const entities = products.map((p) =>
      this.productRepository.create({ ...p, userId }),
    );
    return this.productRepository.save(entities);
  }
}
