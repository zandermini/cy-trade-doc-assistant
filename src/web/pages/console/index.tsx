import { Card } from '@buildingai/ui/components/ui/card';
import { OverviewCard } from '@buildingai/ui/components/dashboard/overview-card';

export default function ConsoleIndexPage() {
  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">应用概览</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">总用户数</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">总报价单</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">总对话数</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">总消耗积分</h3>
          <p className="text-3xl font-bold">0</p>
        </Card>
      </div>
    </div>
  );
}
