import { useState } from 'react';
import { Button } from '@buildingai/ui/components/ui/button';
import { Input } from '@buildingai/ui/components/ui/input';
import { Card } from '@buildingai/ui/components/ui/card';
import { Spinner } from '@buildingai/ui/components/ui/spinner';
import { Table } from '@buildingai/ui/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ProductService, Product } from '../../services/web/product';

export default function ProductListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchKeyword, setSearchKeyword] = useState('');
  const userId = 'current-user-id';

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', userId],
    queryFn: () => ProductService.list(userId),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ProductService.delete(id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', userId] });
    },
  });

  const filteredProducts = products.filter(
    (p) =>
      p.userCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      p.nameZh.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(searchKeyword.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个商品吗？')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">商品库</h1>
        <Button onClick={() => navigate('/products/new')}>新增商品</Button>
      </div>

      <Card className="p-4">
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="搜索商品编号、名称..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">暂无商品</div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>商品编号</Table.Head>
                <Table.Head>商品名称（中文）</Table.Head>
                <Table.Head>商品名称（英文）</Table.Head>
                <Table.Head>规格</Table.Head>
                <Table.Head>单位</Table.Head>
                <Table.Head>单价</Table.Head>
                <Table.Head>最小起订量</Table.Head>
                <Table.Head>HS编码</Table.Head>
                <Table.Head>操作</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredProducts.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell className="font-medium">{product.userCode}</Table.Cell>
                  <Table.Cell>{product.nameZh}</Table.Cell>
                  <Table.Cell>{product.nameEn || '-'}</Table.Cell>
                  <Table.Cell>{product.specification || '-'}</Table.Cell>
                  <Table.Cell>{product.unit}</Table.Cell>
                  <Table.Cell>${product.unitPrice.toFixed(2)}</Table.Cell>
                  <Table.Cell>{product.moq}</Table.Cell>
                  <Table.Cell>{product.hsCode || '-'}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        编辑
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
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
