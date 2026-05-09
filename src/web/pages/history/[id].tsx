import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@buildingai/ui/components/ui/card';
import { Button } from '@buildingai/ui/components/ui/button';
import { Spinner } from '@buildingai/ui/components/ui/spinner';
import { useQuery } from '@tanstack/react-query';
import { QuotationService } from '../../services/web/quotation';
import { QuotationPreview } from '../../components/chat/quotation-preview';

export default function HistoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = 'current-user-id';

  const { data: quotation, isLoading } = useQuery({
    queryKey: ['quotation', id],
    queryFn: () => QuotationService.get(userId, id!),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner />
      </div>
    );
  }

  if (!quotation) {
    return <div className="p-6 text-center">报价单不存在</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{quotation.quotationNo}</h1>
          <p className="text-muted-foreground">
            {quotation.type} - 创建于 {new Date(quotation.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/history')}>
            返回列表
          </Button>
          <Button variant="outline">导出 PDF</Button>
          <Button variant="outline">导出 Word</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuotationPreview quotation={quotation} />
      </div>
    </div>
  );
}
