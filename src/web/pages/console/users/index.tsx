import { Card } from '@buildingai/ui/components/ui/card';
import { Table } from '@buildingai/ui/components/ui/table';
import { useQuery } from '@tanstack/react-query';
import { requester } from '@buildingai/extension-sdk';

const usersApi = requester('/api/admin/plugin/cy-trade-doc-assistant/users');

export default function ConsoleUsersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => usersApi.get('/conversations').then((res) => res.data),
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">用户管理</h1>

      <Card className="p-4">
        <h3 className="mb-4 text-lg font-medium">用户列表</h3>
        {isLoading ? (
          <div className="py-8 text-center">加载中...</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>用户ID</Table.Head>
                <Table.Head>对话次数</Table.Head>
                <Table.Head>消耗积分</Table.Head>
                <Table.Head>操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <tr>
                <td colSpan={4} className="py-4 text-center text-muted-foreground">
                  暂无数据
                </td>
              </tr>
            </Table.Body>
          </Table>
        )}
      </Card>
    </div>
  );
}
