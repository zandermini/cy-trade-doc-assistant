import { useState } from 'react';
import { Button } from '@buildingai/ui/components/ui/button';
import { Card } from '@buildingai/ui/components/ui/card';
import { Input } from '@buildingai/ui/components/ui/input';
import { Label } from '@buildingai/ui/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@buildingai/ui/components/ui/select';

interface QuotationItem {
  productId: string;
  userCode: string;
  nameZh: string;
  nameEn?: string;
  specification?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

interface Quotation {
  type: 'PI' | 'CI' | 'PLI' | 'SC';
  customerSnapshot?: {
    companyName: string;
    companyNameEn?: string;
    country: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  items: QuotationItem[];
  subtotal: number;
  currency: string;
  validUntil?: string;
  paymentTerms?: string;
  shippingTerms?: string;
  deliveryTime?: string;
  notes?: string;
}

interface QuotationPreviewProps {
  quotation: Quotation | null;
  onUpdate?: (quotation: Quotation) => void;
}

export function QuotationPreview({ quotation, onUpdate }: QuotationPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Quotation | null>(quotation);

  if (!quotation) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">报价单预览</h2>
        </div>
        <div className="flex flex-1 items-center justify-center text-muted-foreground">
          <p>暂无报价单</p>
          <p className="mt-2 text-sm">在左侧输入需求，AI 将自动生成报价单</p>
        </div>
      </div>
    );
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    if (!editData) return;
    const newItems = [...editData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;
    }
    const newSubtotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setEditData({ ...editData, items: newItems, subtotal: newSubtotal });
    onUpdate?.({ ...editData, items: newItems, subtotal: newSubtotal });
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!editData) return;
    setEditData({ ...editData, [field]: value });
    onUpdate?.({ ...editData, [field]: value });
  };

  const currentData = isEditing && editData ? editData : quotation;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold">报价单预览</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '预览' : '编辑'}
          </Button>
          <Button variant="outline" size="sm">
            导出 PDF
          </Button>
          <Button variant="outline" size="sm">
            导出 Word
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">报价单</h3>
              <p className="text-sm text-muted-foreground">
                {currentData.type === 'PI' && '形式发票 Proforma Invoice'}
                {currentData.type === 'CI' && '商业发票 Commercial Invoice'}
                {currentData.type === 'PLI' && '预发票 Proforma Invoice'}
                {currentData.type === 'SC' && '销售合同 Sales Contract'}
              </p>
            </div>
            <Select
              value={currentData.type}
              onValueChange={(value) => handleFieldChange('type', value)}
              disabled={!isEditing}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PI">形式发票 PI</SelectItem>
                <SelectItem value="CI">商业发票 CI</SelectItem>
                <SelectItem value="PLI">预发票 PLI</SelectItem>
                <SelectItem value="SC">销售合同 SC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">卖方</Label>
              <div className="mt-1 rounded border bg-muted/50 p-2">
                <p className="font-medium">Your Company Name</p>
                <p className="text-sm">Your Address</p>
                <p className="text-sm">Tel: +1 234 5678</p>
              </div>
            </div>
            <div>
              <Label className="text-muted-foreground">买方</Label>
              {isEditing ? (
                <Input
                  className="mt-1"
                  value={currentData.customerSnapshot?.companyName || ''}
                  onChange={(e) =>
                    handleFieldChange('customerSnapshot', {
                      ...currentData.customerSnapshot,
                      companyName: e.target.value,
                    })
                  }
                  placeholder="客户公司名称"
                />
              ) : (
                <div className="mt-1 rounded border p-2">
                  <p className="font-medium">
                    {currentData.customerSnapshot?.companyName || '-'}
                  </p>
                  <p className="text-sm">
                    {currentData.customerSnapshot?.country || '-'}
                  </p>
                  <p className="text-sm">
                    {currentData.customerSnapshot?.address || '-'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4 overflow-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border bg-muted">
                  <th className="border p-2 text-left">#</th>
                  <th className="border p-2 text-left">商品编号</th>
                  <th className="border p-2 text-left">商品名称</th>
                  <th className="border p-2 text-left">规格</th>
                  <th className="border p-2 text-right">数量</th>
                  <th className="border p-2 text-right">单价</th>
                  <th className="border p-2 text-right">总价</th>
                </tr>
              </thead>
              <tbody>
                {currentData.items.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">
                      {isEditing ? (
                        <Input
                          value={item.userCode}
                          onChange={(e) => handleItemChange(index, 'userCode', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        item.userCode
                      )}
                    </td>
                    <td className="border p-2">
                      {isEditing ? (
                        <Input
                          value={item.nameZh}
                          onChange={(e) => handleItemChange(index, 'nameZh', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        item.nameZh
                      )}
                    </td>
                    <td className="border p-2">
                      {isEditing ? (
                        <Input
                          value={item.specification || ''}
                          onChange={(e) => handleItemChange(index, 'specification', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        item.specification || '-'
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                          className="h-8 w-20 text-right"
                        />
                      ) : (
                        `${item.quantity} ${item.unit}`
                      )}
                    </td>
                    <td className="border p-2 text-right">
                      {isEditing ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                          className="h-8 w-24 text-right"
                        />
                      ) : (
                        `$${item.unitPrice.toFixed(2)}`
                      )}
                    </td>
                    <td className="border p-2 text-right font-medium">
                      ${item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="border p-2 text-right font-bold">
                    合计 TOTAL:
                  </td>
                  <td className="border p-2 text-right text-lg font-bold">
                    ${currentData.subtotal.toFixed(2)} {currentData.currency}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-muted-foreground">有效期</Label>
              {isEditing ? (
                <Input
                  type="date"
                  value={currentData.validUntil || ''}
                  onChange={(e) => handleFieldChange('validUntil', e.target.value)}
                  className="mt-1"
                />
              ) : (
                <p className="mt-1">{currentData.validUntil || '-'}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">付款方式</Label>
              {isEditing ? (
                <Input
                  value={currentData.paymentTerms || ''}
                  onChange={(e) => handleFieldChange('paymentTerms', e.target.value)}
                  className="mt-1"
                  placeholder="T/T 30% deposit"
                />
              ) : (
                <p className="mt-1">{currentData.paymentTerms || '-'}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">运输条款</Label>
              {isEditing ? (
                <Input
                  value={currentData.shippingTerms || ''}
                  onChange={(e) => handleFieldChange('shippingTerms', e.target.value)}
                  className="mt-1"
                  placeholder="FOB Shanghai"
                />
              ) : (
                <p className="mt-1">{currentData.shippingTerms || '-'}</p>
              )}
            </div>
            <div>
              <Label className="text-muted-foreground">交货期限</Label>
              {isEditing ? (
                <Input
                  value={currentData.deliveryTime || ''}
                  onChange={(e) => handleFieldChange('deliveryTime', e.target.value)}
                  className="mt-1"
                  placeholder="30 days"
                />
              ) : (
                <p className="mt-1">{currentData.deliveryTime || '-'}</p>
              )}
            </div>
          </div>

          {currentData.notes && (
            <div className="mt-4">
              <Label className="text-muted-foreground">备注</Label>
              <p className="mt-1 rounded border bg-muted/50 p-2 text-sm">
                {currentData.notes}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
