import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Spinner } from '@buildingai/ui/components/ui/spinner';
import { Card } from '@buildingai/ui/components/ui/card';
import { ScrollArea } from '@buildingui/shadcn/ui/scroll-area';
import { ProductService, CustomerService, ChatService } from '../services';
import { QuotationPreview } from '../components/chat/quotation-preview';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  quotation?: any;
  timestamp: Date;
}

export default function IndexPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: '您好！我是外贸单证助手。\n\n请告诉我您需要生成什么报价单？\n\n例如："给美国 ABC 公司报价 SKU-001 (2000件)，P002 (3000条)，5月31日前有效"',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<any>(null);
  const queryClient = useQueryClient();

  const userId = 'current-user-id';

  const { data: products = [] } = useQuery({
    queryKey: ['products', userId],
    queryFn: () => ProductService.list(userId),
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers', userId],
    queryFn: () => CustomerService.list(userId),
  });

  const createQuotationMutation = useMutation({
    mutationFn: (data: any) => ProductService.list(userId).then(() => data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations', userId] });
    },
  });

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    try {
      const intent = await ChatService.parseUserIntent(inputValue, userId);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `正在分析您的需求...\n\n找到以下信息：
- 客户：${intent.customerName || '未指定'}
- 产品：${intent.productCodes.join(', ') || '未指定'}
- 数量：${intent.quantity || '未指定'}
- 有效期：${intent.validUntil || '未指定'}

正在生成报价单...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      const productCodes = intent.productCodes.filter(Boolean);
      const matchedProducts = products.filter((p) =>
        productCodes.some((code) => p.userCode.toLowerCase() === code.toLowerCase())
      );

      if (matchedProducts.length > 0) {
        const quantities = new Map<string, number>();
        productCodes.forEach((code) => {
          const qtyMatch = inputValue.match(new RegExp(`${code}\\s*[\\(（]?(\\d+)`, 'i'));
          if (qtyMatch) {
            quantities.set(code, parseInt(qtyMatch[1]));
          } else {
            quantities.set(code, 1);
          }
        });

        const items = matchedProducts.map((p) => ({
          productId: p.id,
          userCode: p.userCode,
          nameZh: p.nameZh,
          nameEn: p.nameEn || '',
          specification: p.specification || '',
          quantity: quantities.get(p.userCode) || 1,
          unit: p.unit,
          unitPrice: p.unitPrice,
          totalPrice: (quantities.get(p.userCode) || 1) * p.unitPrice,
          hsCode: p.hsCode,
        }));

        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);

        let matchedCustomer: any = null;
        if (intent.customerName) {
          matchedCustomer = customers.find(
            (c) =>
              c.companyName.toLowerCase().includes(intent.customerName.toLowerCase()) ||
              (c.companyNameEn && c.companyNameEn.toLowerCase().includes(intent.customerName.toLowerCase()))
          );
        }

        const quotationData = {
          type: 'PI',
          customerSnapshot: matchedCustomer
            ? {
                id: matchedCustomer.id,
                companyName: matchedCustomer.companyName,
                companyNameEn: matchedCustomer.companyNameEn,
                country: matchedCustomer.country,
                address: matchedCustomer.address,
                addressEn: matchedCustomer.addressEn,
                contactPerson: matchedCustomer.contactPerson,
                phone: matchedCustomer.phone,
                email: matchedCustomer.email,
              }
            : null,
          items,
          subtotal,
          currency: 'USD',
          validUntil: intent.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          paymentTerms: 'T/T 30% deposit, balance against copy of B/L',
          status: 'draft',
        };

        setCurrentQuotation(quotationData);

        const successMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: '✅ 报价单已生成！\n\n您可以在右侧编辑面板中查看和修改报价单内容，确认无误后可导出为 PDF 或 Word 文档。',
          quotation: quotationData,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, successMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: '⚠️ 未找到匹配的商品。\n\n请确保您的商品编号正确，例如：SKU-001、P001 等。\n\n您可以先到"商品库"中添加商品。',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '处理您的请求时出现错误，请稍后重试。',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      <div className="flex flex-1 flex-col rounded-lg border bg-card">
        <div className="flex items-center border-b px-4 py-3">
          <h1 className="text-lg font-semibold">AI 对话生成报价单</h1>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                  <div className="mt-1 text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner className="size-4" />
                <span>正在分析...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              placeholder="输入您的需求，例如：给 ABC 公司报价 SKU-001 (2000件)，P002 (3000条)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isGenerating}
            />
            <Button onClick={handleSend} disabled={isGenerating || !inputValue.trim()}>
              发送
            </Button>
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm">
              选择商品
            </Button>
            <Button variant="outline" size="sm">
              选择客户
            </Button>
            <Button variant="outline" size="sm">
              使用模板
            </Button>
          </div>
        </div>
      </div>

      <div className="w-1/2 rounded-lg border bg-card">
        <QuotationPreview
          quotation={currentQuotation}
          onUpdate={setCurrentQuotation}
        />
      </div>
    </div>
  );
}
