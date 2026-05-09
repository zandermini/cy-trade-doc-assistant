import { useQuery } from '@tanstack/react-query';
import { Button } from '@buildingai/ui/components/ui/button';
import { Card } from '@buildingai/ui/components/ui/card';
import { Table } from '@buildingai/ui/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { QuotationService } from '../../services/web/quotation';

export default function HistoryListPage() {
  const navigate = useNavigate();
  const userId = 'current-user-id';

  const { data, isLoading } = useQuery({
    queryKey: ['quotations', userId],
    queryFn: () => QuotationService.list(userId),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">草稿</span>;
      case 'confirmed':
        return <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-800">已确认</span>;
      case 'sent':
        return <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">已发送</span>;
      default:
        return <span className="rounded bg-gray-100 px-2 py-1 text-xs">{status}</span>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">报价单历史</h1>
      </div>

      <Card className="p-4">
        {isLoading ? (
          <div className="py-12 text-center">加载中...</div>
        ) : !data?.items || data.items.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">暂无报价单</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>报价单号</Table.Head>
                <Table.Head>类型</Table.Head>
                <Table.Head>客户</Table.Head>
                <Table.Head>金额</Table.Head>
                <Table.Head>状态</Table.Head>
                <Table.Head>创建时间</Table.Head>
                <Table.Head>操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.items.map((quotation) => (
                <Table.Row key={quotation.id}>
                  <Table.Cell className="font-medium">{quotation.quotationNo}</Table.Cell>
                  <Table.Cell>{quotation.type}</Table.Cell>
                  <Table.Cell>{quotation.customerSnapshot?.companyName || '-'}</Table.Cell>
                  <Table.Cell>
                    {quotation.currency} {quotation.subtotal.toFixed(2)}
                  </Table.Cell>
                  <Table.Cell>{getStatusBadge(quotation.status)}</Table.Cell>
                  <Table.Cell>{new Date(quotation.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/history/${quotation.id}`)}>
                      查看
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
