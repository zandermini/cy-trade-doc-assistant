import { requester } from '@buildingai/extension-sdk';
import { ProductService } from './web/product';
import { CustomerService } from './web/customer';
import { QuotationService, QuotationItem, CustomerSnapshot } from './web/quotation';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  quotation?: any;
}

export interface GenerateQuotationParams {
  userId: string;
  message: string;
}

export const ChatService = {
  async parseUserIntent(message: string, userId: string) {
    const intent = {
      customerName: '',
      productCodes: [] as string[],
      quantity: 0,
      validUntil: '',
    };

    const customerMatch = message.match(/(?:给|to|for)\s+([A-Za-z0-9\s]+?)(?:公司|Co\.|LLC|Inc\.)/i);
    if (customerMatch) {
      intent.customerName = customerMatch[1].trim();
    }

    const productMatches = message.matchAll(/(SKU-\d+|P\d+|[\w-]+)\s*[\(（]?(\d+)\s*(?:件|个|条|台|套|米|kg)/gi);
    for (const match of productMatches) {
      intent.productCodes.push(match[1]);
      intent.quantity += parseInt(match[2]);
    }

    const dateMatch = message.match(/(?:有效期|valid|截止).*?(\d{1,2}[月\-/]\d{1,2}(?:日)?)/);
    if (dateMatch) {
      intent.validUntil = dateMatch[1];
    }

    return intent;
  },

  async searchProducts(userId: string, codes: string[]) {
    const allProducts = await ProductService.list(userId);
    return allProducts.filter((p) => codes.includes(p.userCode));
  },

  async searchCustomer(userId: string, companyName: string) {
    const allCustomers = await CustomerService.list(userId);
    return allCustomers.find(
      (c) =>
        c.companyName.toLowerCase().includes(companyName.toLowerCase()) ||
        (c.companyNameEn && c.companyNameEn.toLowerCase().includes(companyName.toLowerCase()))
    );
  },

  buildQuotationItems(products: any[], quantities: Map<string, number>): QuotationItem[] {
    return products.map((p) => ({
      productId: p.id,
      userCode: p.userCode,
      nameZh: p.nameZh,
      nameEn: p.nameEn,
      specification: p.specification,
      quantity: quantities.get(p.userCode) || 1,
      unit: p.unit,
      unitPrice: p.unitPrice,
      totalPrice: (quantities.get(p.userCode) || 1) * p.unitPrice,
      hsCode: p.hsCode,
    }));
  },

  calculateSubtotal(items: QuotationItem[]): number {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  },

  buildSystemPrompt() {
    return `你是外贸单证助手，帮助用户生成报价单。
用户会告诉你：
1. 客户名称和公司
2. 需要哪些产品（用编号如 SKU-001、P001）
3. 每个产品的数量
4. 有效期等条款

你的任务是：
1. 理解用户需求
2. 从商品库匹配产品
3. 生成规范的报价单

报价单格式：
- 报价单号：自动生成
- FROM：公司信息
- TO：客户信息
- 商品明细表格
- 合计金额
- 有效期、付款方式等条款

请用中文回复。`;
  },
};
