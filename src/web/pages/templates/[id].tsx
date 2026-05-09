import { useParams } from 'react-router-dom';
import { Card } from '@buildingai/ui/components/ui/card';
import { Spinner } from '@buildingai/ui/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { TemplateService } from '../../services/web/template';

export default function TemplateDetailPage() {
  const { id } = useParams();

  const { data: template, isLoading } = useQuery({
    queryKey: ['template', id],
    queryFn: () => TemplateService.get(id!),
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{template.name}</h1>
        <p className="text-muted-foreground">
          {template.type} - {template.isSystem ? '系统模板' : '自定义模板'}
        </p>
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
