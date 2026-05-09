import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Card } from '@buildingai/ui/components/ui/card';
import { Table } from '@buildingai/ui/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { CustomerService, Customer } from '../../services/web/customer';

export default function CustomerListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState('');
  const userId = 'current-user-id';

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', userId],
    queryFn: () => CustomerService.list(userId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => CustomerService.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers', userId] });
    },
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (c.companyNameEn && c.companyNameEn.toLowerCase().includes(searchKeyword.toLowerCase())) ||
      c.country.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个客户吗？')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">客户管理</h1>
        <Button onClick={() => navigate('/customers/new')}>新增客户</Button>
      </div>

      <Card className="p-4">
        <div className="mb-4">
          <Input
            placeholder="搜索客户名称、国家..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="py-12 text-center">加载中...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">暂无客户</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>公司名称</Table.Head>
                <Table.Head>公司名称（英文）</Table.Head>
                <Table.Head>国家</Table.Head>
                <Table.Head>联系人</Table.Head>
                <Table.Head>电话</Table.Head>
                <Table.Head>邮箱</Table.Head>
                <Table.Head>操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredCustomers.map((customer) => (
                <Table.Row key={customer.id}>
                  <Table.Cell className="font-medium">{customer.companyName}</Table.Cell>
                  <Table.Cell>{customer.companyNameEn || '-'}</Table.Cell>
                  <Table.Cell>{customer.country}</Table.Cell>
                  <Table.Cell>{customer.contactPerson || '-'}</Table.Cell>
                  <Table.Cell>{customer.phone || '-'}</Table.Cell>
                  <Table.Cell>{customer.email || '-'}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/customers/${customer.id}`)}>
                        编辑
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.id)}>
                        删除
                      </Button>
                    </div>
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
