import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { AiProvider, Secret } from '@buildingai/db/entities';

export interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateQuotationResult {
  success: boolean;
  data?: {
    customerInfo: any;
    items: any[];
    totalAmount: number;
    currency: string;
    validUntil: string;
    paymentTerms: string;
    deliveryTerms: string;
  };
  error?: string;
}

@Injectable()
export class DeepseekService {
  private readonly baseUrl = 'https://api.deepseek.com';
  private readonly model = 'deepseek-chat';

  constructor(
    @InjectRepository(AiProvider, 'default')
    private readonly aiProviderRepository: Repository<AiProvider>,
    @InjectRepository(Secret, 'default')
    private readonly secretRepository: Repository<Secret>,
  ) {}

  private async getApiKey(): Promise<string | null> {
    try {
      const provider = await this.aiProviderRepository.findOne({
        where: { provider: 'deepseek', isActive: true },
      });

      if (!provider || !provider.bindSecretId) {
        return null;
      }

      const secret = await this.secretRepository.findOne({
        where: { id: provider.bindSecretId },
      });

      if (!secret || !secret.fieldValues) {
        return null;
      }

      const apiKeyField = secret.fieldValues.find(f => f.name === 'apiKey');
      if (apiKeyField?.value) {
        return apiKeyField.value;
      }

      return null;
    } catch (error) {
      console.error('获取 Deepseek API Key 失败:', error);
      return null;
    }
  }

  private async isConfigured(): Promise<boolean> {
    const apiKey = await this.getApiKey();
    return !!apiKey && apiKey.length > 0;
  }

  async chat(messages: DeepseekMessage[]): Promise<string> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('Deepseek API Key 未配置，请在主应用后台配置 Deepseek 供应商');
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 4000,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 60000,
        },
      );

      return response.data.choices[0]?.message?.content || '';
    } catch (error: any) {
      console.error('Deepseek API 调用失败:', error.response?.data || error.message);
      throw new Error(`Deepseek API 调用失败: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async generateQuotation(params: {
    userRequirement: string;
    products?: any[];
    customerInfo?: any;
    templateType?: string;
  }): Promise<GenerateQuotationResult> {
    const { userRequirement, products, customerInfo, templateType = 'PI' } = params;

    if (!(await this.isConfigured())) {
      return {
        success: false,
        error: 'Deepseek API Key 未配置，请在主应用后台配置 Deepseek 供应商',
      };
    }

    const systemPrompt = `你是一个专业的外贸单证助手，负责生成报价单。请根据用户提供的信息，生成结构化的报价单数据。

要求：
1. 返回 JSON 格式的报价单数据
2. 包含客户信息、商品明细、总金额、有效期、付款条款等
3. 商品价格必须合理，基于用户提供的信息或市场行情
4. 如果用户提供商品信息，优先使用用户提供的信息
5. 货币默认使用 USD，可根据用户要求调整为 EUR、CNY 等

请严格按照以下 JSON 格式返回（不要包含任何其他内容）：
{
  "customerInfo": {
    "name": "客户公司名称",
    "address": "客户地址",
    "contact": "联系人姓名",
    "email": "邮箱",
    "phone": "电话"
  },
  "items": [
    {
      "productCode": "产品编号",
      "productName": "产品名称",
      "description": "产品描述",
      "quantity": 数量,
      "unit": "单位，如 PCS/SETS",
      "unitPrice": 单价,
      "totalPrice": 总价
    }
  ],
  "totalAmount": 总金额,
  "currency": "USD",
  "validUntil": "有效期，如 2024-12-31",
  "paymentTerms": "付款条款，如 30% deposit, 70% before shipment",
  "deliveryTerms": "交货条款，如 FOB Shanghai"
}`;

    let userPrompt = userRequirement;

    if (products && products.length > 0) {
      userPrompt += '\n\n可用的商品信息：\n';
      products.forEach((p, i) => {
        userPrompt += `${i + 1}. 编号: ${p.productCode || p.customCode || 'N/A'}, 名称: ${p.name}, 规格: ${p.specifications || 'N/A'}, 单价: ${p.price || p.unitPrice || '待询'}\n`;
      });
    }

    if (customerInfo) {
      userPrompt += `\n\n客户信息：${JSON.stringify(customerInfo, null, 2)}`;
    }

    userPrompt += `\n\n单证类型：${templateType === 'PI' ? '形式发票 (Proforma Invoice)' : templateType === 'CI' ? '商业发票 (Commercial Invoice)' : '报价单 (Quotation)'}`;

    try {
      const response = await this.chat([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        return {
          success: false,
          error: '无法解析报价单数据，请重试',
        };
      }

      const data = JSON.parse(jsonMatch[0]);

      return {
        success: true,
        data: {
          customerInfo: data.customerInfo || {},
          items: data.items || [],
          totalAmount: data.totalAmount || 0,
          currency: data.currency || 'USD',
          validUntil: data.validUntil || this.getDefaultValidUntil(),
          paymentTerms: data.paymentTerms || '30% deposit, 70% balance before shipment',
          deliveryTerms: data.deliveryTerms || 'FOB Shanghai',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '生成报价单失败',
      };
    }
  }

  private getDefaultValidUntil(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }
}
