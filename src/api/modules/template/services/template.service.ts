import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuotationTemplate } from '../../db/entities/template.entity';

@Injectable()
export class TemplateService extends Repository<QuotationTemplate> {
  constructor(
    @InjectRepository(QuotationTemplate, 'extension_cy_trade_doc_assistant')
    private readonly templateRepository: Repository<QuotationTemplate>,
  ) {
    super(
      templateRepository.target,
      templateRepository.manager,
      templateRepository.queryRunner,
    );
  }

  async findAll(userId?: string): Promise<QuotationTemplate[]> {
    const query = this.templateRepository
      .createQueryBuilder('template')
      .where('template.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('(template.isSystem = :isSystem OR template.userId = :userId)', {
        isSystem: true,
        userId: userId || '',
      })
      .orderBy('template.isSystem', 'DESC')
      .addOrderBy('template.createdAt', 'DESC');

    return query.getMany();
  }

  async findByType(type: string, userId?: string): Promise<QuotationTemplate[]> {
    return this.templateRepository
      .createQueryBuilder('template')
      .where('template.type = :type', { type })
      .andWhere('template.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('(template.isSystem = :isSystem OR template.userId = :userId)', {
        isSystem: true,
        userId: userId || '',
      })
      .orderBy('template.isSystem', 'DESC')
      .addOrderBy('template.createdAt', 'DESC')
      .getMany();
  }

  async create(data: Partial<QuotationTemplate>): Promise<QuotationTemplate> {
    const template = this.templateRepository.create(data);
    return this.templateRepository.save(template);
  }

  async update(id: string, data: Partial<QuotationTemplate>): Promise<QuotationTemplate | null> {
    await this.templateRepository.update({ id }, data);
    return this.findOne({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    await this.templateRepository.update({ id }, { isDeleted: true });
  }

  async initSystemTemplates(): Promise<void> {
    const existing = await this.templateRepository.findOne({
      where: { name: '标准报价单', isSystem: true },
    });

    if (existing) return;

    const systemTemplates = [
      {
        name: '标准报价单',
        type: 'PI',
        description: '通用形式发票模板',
        isSystem: true,
        content: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
          },
          footer: {
            showBankInfo: true,
            showSignature: true,
          },
          styles: {
            fontSize: 12,
            fontFamily: 'Arial',
          },
        },
      },
      {
        name: '商业发票',
        type: 'CI',
        description: '正式商业发票模板',
        isSystem: true,
        content: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
          },
          footer: {
            showBankInfo: true,
            showSignature: true,
          },
          styles: {
            fontSize: 12,
            fontFamily: 'Arial',
          },
        },
      },
      {
        name: '形式发票',
        type: 'PLI',
        description: '形式发票模板',
        isSystem: true,
        content: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
          },
          footer: {
            showBankInfo: true,
            showSignature: false,
          },
          styles: {
            fontSize: 12,
            fontFamily: 'Arial',
          },
        },
      },
      {
        name: '销售合同',
        type: 'SC',
        description: '销售合同模板',
        isSystem: true,
        content: {
          header: {
            showLogo: true,
            showCompanyInfo: true,
          },
          footer: {
            showBankInfo: true,
            showSignature: true,
          },
          styles: {
            fontSize: 12,
            fontFamily: 'Arial',
          },
        },
      },
    ];

    for (const template of systemTemplates) {
      await this.templateRepository.save(this.templateRepository.create(template));
    }
  }
}
