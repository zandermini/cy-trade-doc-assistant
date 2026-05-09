import { useState, useEffect } from 'react';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Card } from '@buildingai/ui/components/ui/card';
import { Label } from '@buildingai/ui/components/ui/label';
import { useQuery, useMutation } from '@tanstack/react-query';
import { requester } from '@buildingai/extension-sdk';

const settingsApi = requester('/api/admin/plugin/cy-trade-doc-assistant/settings');

export default function ConsoleSettingsPage() {
  const [settings, setSettings] = useState({
    modelId: '',
    billingPerGeneration: 10,
    billingPerQuery: 1,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => settingsApi.get('/').then((res) => res.data),
  });

  useEffect(() => {
    if (data) {
      setSettings({
        modelId: data.modelId || '',
        billingPerGeneration: data.billingPerGeneration || 10,
        billingPerQuery: data.billingPerQuery || 1,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => settingsApi.put('/', data).then((res) => res.data),
    onSuccess: () => {
      alert('设置已保存');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(settings);
  };

  if (isLoading) {
    return <div className="p-6">加载中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">应用设置</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h3 className="mb-4 text-lg font-medium">AI 模型配置</h3>
            <div className="max-w-md">
              <Label>选择 AI 模型</Label>
              <Input
                value={settings.modelId}
                onChange={(e) => setSettings({ ...settings, modelId: e.target.value })}
                placeholder="输入模型 ID 或选择..."
              />
              <p className="mt-1 text-sm text-muted-foreground">
                设置用于生成报价单的 AI 模型
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-medium">积分配置</h3>
            <div className="max-w-md space-y-4">
              <div>
                <Label>生成报价单消耗积分</Label>
                <Input
                  type="number"
                  value={settings.billingPerGeneration}
                  onChange={(e) =>
                    setSettings({ ...settings, billingPerGeneration: parseInt(e.target.value) })
                  }
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  用户每次生成报价单消耗的积分数量
                </p>
              </div>
              <div>
                <Label>对话查询消耗积分</Label>
                <Input
                  type="number"
                  value={settings.billingPerQuery}
                  onChange={(e) =>
                    setSettings({ ...settings, billingPerQuery: parseInt(e.target.value) })
                  }
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  用户每次对话查询消耗的积分数量
                </p>
              </div>
            </div>
          </div>

          <Button type="submit">保存设置</Button>
        </form>
      </Card>
    </div>
  );
}
