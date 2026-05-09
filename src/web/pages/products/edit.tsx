import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Card } from '@buildingai/ui/components/ui/card';
import { Label } from '@buildingai/ui/components/ui/label';
import { ProductService, Product } from '../../services/web/product';

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const userId = 'current-user-id';
  const isNew = !id || id === 'new';

  const [formData, setFormData] = useState<Partial<Product>>({
    userCode: '',
    nameZh: '',
    nameEn: '',
    specification: '',
    unit: '件',
    unitPrice: 0,
    moq: 1,
    hsCode: '',
    category: '',
    notes: '',
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.get(userId, id!),
    enabled: !isNew,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const createMutation = useMutation({
    mutationFn: (data: any) => ProductService.create({ ...data, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userId] });
      navigate('/products');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => ProductService.update(id!, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userId] });
      navigate('/products');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew) {
      createMutation.mutate(formData);
    } else {
      updateMutation.mutate(formData);
    }
  };

  if (!isNew && isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{isNew ? '新增商品' : '编辑商品'}</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="userCode">商品编号 *</Label>
              <Input
                id="userCode"
                value={formData.userCode}
                onChange={(e) => setFormData({ ...formData, userCode: e.target.value })}
                placeholder="例如：SKU-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="nameZh">商品名称（中文） *</Label>
              <Input
                id="nameZh"
                value={formData.nameZh}
                onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                placeholder="商品中文名称"
                required
              />
            </div>

            <div>
              <Label htmlFor="nameEn">商品名称（英文）</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                placeholder="商品英文名称"
              />
            </div>

            <div>
              <Label htmlFor="specification">规格型号</Label>
              <Input
                id="specification"
                value={formData.specification}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                placeholder="例如：E27 / 5W"
              />
            </div>

            <div>
              <Label htmlFor="unit">单位 *</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="例如：件、个、米"
                required
              />
            </div>

            <div>
              <Label htmlFor="unitPrice">单价（美元） *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                required
              />
            </div>

            <div>
              <Label htmlFor="moq">最小起订量</Label>
              <Input
                id="moq"
                type="number"
                value={formData.moq}
                onChange={(e) => setFormData({ ...formData, moq: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label htmlFor="hsCode">HS编码</Label>
              <Input
                id="hsCode"
                value={formData.hsCode}
                onChange={(e) => setFormData({ ...formData, hsCode: e.target.value })}
                placeholder="海关编码"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">备注</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="其他备注信息"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">{isNew ? '创建' : '保存'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/products')}>
              取消
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
