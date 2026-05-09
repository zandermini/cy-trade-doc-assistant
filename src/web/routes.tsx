import { defineRouteOption } from '@buildingai/web-core';
import packageJson from './../../package.json';
import MainLayout from './pages/layout/main-layout';
import ChatPage from './pages/index';
import ProductListPage from './pages/products/list';
import ProductEditPage from './pages/products/edit';
import CustomerListPage from './pages/customers/list';
import CustomerEditPage from './pages/customers/edit';
import TemplateListPage from './pages/templates/list';
import TemplateDetailPage from './pages/templates/[id]';
import HistoryListPage from './pages/history/list';
import HistoryDetailPage from './pages/history/[id]';
import CompanyProfilePage from './pages/company-profile/index';
import ConsoleIndexPage from './pages/console/index';
import ConsoleSettingsPage from './pages/console/settings/index';
import ConsoleUsersPage from './pages/console/users/index';
import ConsoleConversationsPage from './pages/console/users/conversations';
import ConsoleTemplatesPage from './pages/console/templates/list';
import ConsoleTemplateEditPage from './pages/console/templates/[id]';

function UserLayout({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}

export const routeOption = defineRouteOption({
  base: `extension/${packageJson.name}`,
  identifier: packageJson.name,
  routes: [
    {
      index: true,
      element: <UserLayout><ChatPage /></UserLayout>,
    },
    {
      path: 'chat',
      element: <UserLayout><ChatPage /></UserLayout>,
    },
    {
      path: 'products',
      element: <UserLayout><ProductListPage /></UserLayout>,
    },
    {
      path: 'products/:id',
      element: <UserLayout><ProductEditPage /></UserLayout>,
    },
    {
      path: 'products/new',
      element: <UserLayout><ProductEditPage /></UserLayout>,
    },
    {
      path: 'customers',
      element: <UserLayout><CustomerListPage /></UserLayout>,
    },
    {
      path: 'customers/:id',
      element: <UserLayout><CustomerEditPage /></UserLayout>,
    },
    {
      path: 'customers/new',
      element: <UserLayout><CustomerEditPage /></UserLayout>,
    },
    {
      path: 'templates',
      element: <UserLayout><TemplateListPage /></UserLayout>,
    },
    {
      path: 'templates/:id',
      element: <UserLayout><TemplateDetailPage /></UserLayout>,
    },
    {
      path: 'history',
      element: <UserLayout><HistoryListPage /></UserLayout>,
    },
    {
      path: 'history/:id',
      element: <UserLayout><HistoryDetailPage /></UserLayout>,
    },
    {
      path: 'company-profile',
      element: <UserLayout><CompanyProfilePage /></UserLayout>,
    },
  ],
  consoleMenus: [
    {
      title: '应用概览',
      path: '/',
      icon: 'layout-dashboard',
    },
    {
      title: '应用设置',
      path: '/settings',
      icon: 'settings',
    },
    {
      title: '用户管理',
      path: '/users',
      icon: 'users',
    },
    {
      title: '模板管理',
      path: '/templates',
      icon: 'file-text',
    },
  ],
  consoleRoutes: [
    {
      index: true,
      element: <ConsoleIndexPage />,
    },
    {
      path: 'settings',
      element: <ConsoleSettingsPage />,
    },
    {
      path: 'users',
      element: <ConsoleUsersPage />,
    },
    {
      path: 'users/conversations',
      element: <ConsoleConversationsPage />,
    },
    {
      path: 'templates',
      element: <ConsoleTemplatesPage />,
    },
    {
      path: 'templates/:id',
      element: <ConsoleTemplateEditPage />,
    },
  ],
});
