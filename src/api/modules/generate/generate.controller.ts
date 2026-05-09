import { BaseController } from '@buildingai/base';
import { Controller, Post, Body } from '@nestjs/common';
import { DeepseekService } from '../ai/deepseek.service';
import { SettingsService } from '../settings/services/settings.service';
import { QuotationService } from '../quotation/services/quotation.service';
import { ConversationService } from '../conversation/services/conversation.service';

class GenerateQuotationDto {
  userId: string;
  userRequirement: string;
  productIds?: string[];
  customerId?: string;
  templateType?: string;
}

@Controller('web/cy-trade-doc-assistant/generate')
export class GenerateController extends BaseController {
  constructor(
    private readonly deepseekService: DeepseekService,
    private readonly settingsService: SettingsService,
    private readonly quotationService: QuotationService,
    private readonly conversationService: ConversationService,
  ) {
    super();
  }

  @Post()
  async generate(@Body() dto: GenerateQuotationDto) {
    const apiKey = await this.settingsService.getDeepseekApiKey();

    if (!apiKey) {
      return this.error('Deepseek API Key 未配置，请联系管理员配置');
    }

    this.deepseekService.setApiKey(apiKey);

    const result = await this.deepseekService.generateQuotation({
      userRequirement: dto.userRequirement,
      templateType: dto.templateType || 'PI',
    });

    if (!result.success) {
      return this.error(result.error || '生成报价单失败');
    }

    const quotationNo = await this.quotationService.generateQuotationNo(dto.userId);

    const quotation = await this.quotationService.create({
      quotationNo,
      userId: dto.userId,
      customerId: dto.customerId,
      templateType: dto.templateType || 'PI',
      customerData: result.data?.customerInfo,
      items: result.data?.items,
      totalAmount: result.data?.totalAmount,
      currency: result.data?.currency,
      validUntil: result.data?.validUntil,
      paymentTerms: result.data?.paymentTerms,
      deliveryTerms: result.data?.deliveryTerms,
      status: 'draft',
      powerCost: await this.settingsService.getBillingConfig().then(c => c.billingPerGeneration),
    });

    await this.conversationService.create({
      userId: dto.userId,
      quotationId: quotation.id,
      userMessage: dto.userRequirement,
      aiResponse: JSON.stringify(result.data),
      powerCost: await this.settingsService.getBillingConfig().then(c => c.billingPerGeneration),
    });

    return this.response(quotation);
  }
}
