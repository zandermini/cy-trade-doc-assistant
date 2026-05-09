import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@buildingai/ui/components/ui/card';
import { Button } from '@buildingai/ui/components/ui/button';
import { Spinner } from '@buildingai/ui/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { requester } from '@buildingai/extension-sdk';

const templatesApi = requester('/api/admin/plugin/cy-trade-doc-assistant/templates');

export default function ConsoleTemplateEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: template, isLoading } = useQuery({
    queryKey: ['admin-template', id],
    queryFn: () => templatesApi.get(`/${id}`).then((res) => res.data),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner />
      </div>
    );
  }

  if (!template) {
    return <div className="p-6 text-center">模板不存在</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground">
            {template.type} - {template.isSystem ? '系统模板' : '自定义模板'}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/templates')}>
          返回
        </Button>
      </div>

      <Card className="p-6">
        <p className="text-muted-foreground">{template.description || '暂无描述'}</p>
        <div className="mt-4">
          <h3 className="mb-2 font-medium">模板内容</h3>
          <pre className="overflow-auto rounded bg-muted p-4 text-sm">
            {JSON.stringify(template.content, null, 2)}
          </pre>
        </div>
      </Card>
    </div>
  );
}
