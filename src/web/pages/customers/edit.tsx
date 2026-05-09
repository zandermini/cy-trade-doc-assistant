import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Card } from '@buildingai/ui/components/ui/card';
import { Label } from '@buildingai/ui/components/ui/label';
import { CustomerService, Customer } from '../../services/web/customer';

export default function CustomerEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const userId = 'current-user-id';
  const isNew = !id || id === 'new';

  const [formData, setFormData] = useState<Partial<Customer>>({
    companyName: '',
    companyNameEn: '',
    country: '',
    address: '',
    addressEn: '',
    contactPerson: '',
    phone: '',
    email: '',
    notes: '',
  });

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', id],
    queryFn: () => CustomerService.get(userId, id!),
    enabled: !isNew,
  });

  useEffect(() => {
    if (customer) {
      setFormData(customer);
    }
  }, [customer]);

  const createMutation = useMutation({
    mutationFn: (data: any) => CustomerService.create({ ...data, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', userId] });
      navigate('/customers');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => CustomerService.update(id!, userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', userId] });
      navigate('/customers');
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
        <h1 className="text-2xl font-bold">{isNew ? '新增客户' : '编辑客户'}</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="companyName">公司名称 *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="公司中文名称"
                required
              />
            </div>

            <div>
              <Label htmlFor="companyNameEn">公司名称（英文）</Label>
              <Input
                id="companyNameEn"
                value={formData.companyNameEn}
                onChange={(e) => setFormData({ ...formData, companyNameEn: e.target.value })}
                placeholder="公司英文名称"
              />
            </div>

            <div>
              <Label htmlFor="country">国家 *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="例如：美国、英国"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">联系人</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">电话</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">地址</Label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="公司地址"
            />
          </div>

          <div>
            <Label htmlFor="notes">备注</Label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">{isNew ? '创建' : '保存'}</Button>
            <Button type="button" variant="outline" onClick={() => navigate('/customers')}>
              取消
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
