import { useState, useEffect } from 'react';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Card } from '@buildingai/ui/components/ui/card';
import { Label } from '@buildingai/ui/components/ui/label';
import { useQuery, useMutation } from '@tanstack/react-query';
import { CompanyProfileService } from '../../services/web/company-profile';

export default function CompanyProfilePage() {
  const userId = 'current-user-id';

  const [formData, setFormData] = useState<any>({
    companyName: '',
    companyNameEn: '',
    address: '',
    addressEn: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    bankName: '',
    bankAccount: '',
    swiftCode: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['company-profile', userId],
    queryFn: () => CompanyProfileService.get(userId),
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => CompanyProfileService.update({ ...data, userId }),
    onSuccess: () => {
      alert('公司信息已保存');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="p-6 text-center">加载中...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">公司信息</h1>
        <p className="text-muted-foreground">设置将显示在报价单上的公司信息</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">基本信息</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>公司名称</Label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="公司中文名称"
                />
              </div>
              <div>
                <Label>公司名称（英文）</Label>
                <Input
                  value={formData.companyNameEn}
                  onChange={(e) => setFormData({ ...formData, companyNameEn: e.target.value })}
                  placeholder="Company Name Co., Ltd."
                />
              </div>
              <div>
                <Label>国家</Label>
                <Input
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="中国"
                />
              </div>
              <div>
                <Label>电话</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>邮箱</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <Label>网站</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label>地址</Label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="公司详细地址"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">银行信息</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label>银行名称</Label>
                <Input
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="Bank Name"
                />
              </div>
              <div>
                <Label>银行账号</Label>
                <Input
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  placeholder="Account Number"
                />
              </div>
              <div>
                <Label>SWIFT 代码</Label>
                <Input
                  value={formData.swiftCode}
                  onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                  placeholder="SWIFT Code"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
