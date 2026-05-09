import { useQuery } from '@tanstack/react-query';
import { Button } from '@buildingai/ui/components/ui/button';
import { Card } from '@buildingai/ui/components/ui/card';
import { Table } from '@buildingai/ui/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { TemplateService } from '../../services/web/template';

export default function TemplateListPage() {
  const navigate = useNavigate();
  const userId = 'current-user-id';

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', userId],
    queryFn: () => TemplateService.list(userId),
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">模板管理</h1>
        <Button onClick={() => navigate('/templates/new')}>新增模板</Button>
      </div>

      <Card className="p-4">
        {isLoading ? (
          <div className="py-12 text-center">加载中...</div>
        ) : templates.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">暂无模板</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>模板名称</Table.Head>
                <Table.Head>类型</Table.Head>
                <Table.Head>描述</Table.Head>
                <Table.Head>类型</Table.Head>
                <Table.Head>操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {templates.map((template) => (
                <Table.Row key={template.id}>
                  <Table.Cell className="font-medium">{template.name}</Table.Cell>
                  <Table.Cell>
                    <span className="rounded bg-primary/10 px-2 py-1 text-xs">
                      {template.isSystem ? '系统模板' : '自定义'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{template.description || '-'}</Table.Cell>
                  <Table.Cell>{template.type}</Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/templates/${template.id}`)}>
                      {template.isSystem ? '预览' : '编辑'}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}
