import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Package, Users, History, Settings } from 'lucide-react';
import { Button } from '@buildingai/ui/components/ui/button';
import { cn } from '@buildingai/ui/utils';
import ProductListPage from './products/list';
import ProductEditPage from './products/edit';
import CustomerListPage from './customers/list';
import CustomerEditPage from './customers/edit';
import TemplateListPage from './templates/list';
import TemplateDetailPage from './templates/[id]';
import HistoryListPage from './history/list';
import HistoryDetailPage from './history/[id]';
import CompanyProfilePage from './company-profile/index';
import ChatPage from './index';

type TabType = 'chat' | 'products' | 'customers' | 'templates' | 'history' | 'profile';

interface TabConfig {
  key: TabType;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const tabs: TabConfig[] = [
  { key: 'chat', label: 'AI 生成', icon: <FileText className="size-4" />, path: '/' },
  { key: 'products', label: '商品库', icon: <Package className="size-4" />, path: '/products' },
  { key: 'customers', label: '客户管理', icon: <Users className="size-4" />, path: '/customers' },
  { key: 'templates', label: '模板管理', icon: <FileText className="size-4" />, path: '/templates' },
  { key: 'history', label: '历史记录', icon: <History className="size-4" />, path: '/history' },
  { key: 'profile', label: '公司信息', icon: <Settings className="size-4" />, path: '/company-profile' },
];

function TabContent({ activeTab }: { activeTab: TabType }) {
  switch (activeTab) {
    case 'chat':
      return <ChatPage />;
    case 'products':
      return <ProductListPage />;
    case 'customers':
      return <CustomerListPage />;
    case 'templates':
      return <TemplateListPage />;
    case 'history':
      return <HistoryListPage />;
    case 'profile':
      return <CompanyProfilePage />;
    default:
      return <ChatPage />;
  }
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (): TabType => {
    const path = location.pathname;
    if (path.includes('/products')) return 'products';
    if (path.includes('/customers')) return 'customers';
    if (path.includes('/templates')) return 'templates';
    if (path.includes('/history')) return 'history';
    if (path.includes('/company-profile')) return 'profile';
    return 'chat';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab: TabConfig) => {
    navigate(tab.path);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center gap-1 px-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            <span className="font-semibold">外贸单证助手</span>
          </div>
          
          <nav className="ml-8 flex items-center gap-1">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => handleTabClick(tab)}
                className={cn(
                  'gap-2 transition-colors',
                  activeTab === tab.key && 'bg-primary/10 text-primary hover:bg-primary/20'
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <TabContent activeTab={activeTab} />
      </main>
    </div>
  );
}
