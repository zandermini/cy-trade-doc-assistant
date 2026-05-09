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

export const routeOption = defineRouteOption({
  base: `extension/${packageJson.name}`,
  identifier: packageJson.name,
  routes: [
    {
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <ChatPage />,
        },
        {
          path: 'chat',
          element: <ChatPage />,
        },
        {
          path: 'products',
          element: <ProductListPage />,
        },
        {
          path: 'products/:id',
          element: <ProductEditPage />,
        },
        {
          path: 'products/new',
          element: <ProductEditPage />,
        },
        {
          path: 'customers',
          element: <CustomerListPage />,
        },
        {
          path: 'customers/:id',
          element: <CustomerEditPage />,
        },
        {
          path: 'customers/new',
          element: <CustomerEditPage />,
        },
        {
          path: 'templates',
          element: <TemplateListPage />,
        },
        {
          path: 'templates/:id',
          element: <TemplateDetailPage />,
        },
        {
          path: 'history',
          element: <HistoryListPage />,
        },
        {
          path: 'history/:id',
          element: <HistoryDetailPage />,
        },
        {
          path: 'company-profile',
          element: <CompanyProfilePage />,
        },
      ],
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
