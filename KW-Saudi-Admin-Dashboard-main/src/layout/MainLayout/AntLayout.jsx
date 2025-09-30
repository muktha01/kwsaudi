import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  TeamOutlined
} from '@ant-design/icons';

// project imports
import Footer from './Footer';
import Customization from '../Customization';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

export default function AntLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    handlerDrawerOpen(!collapsed);
  }, [collapsed]);

  if (menuMasterLoading) return <Loader />;

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate('/pages/login');
  };

  const menuItems = [
    {
      key: 'page-management',
      icon: <DashboardOutlined />,
      label: 'Page Management',
      children: [
        {
          key: 'seo-management',
          label: 'SEO Management',
          path: '/dashboard/seo'
        },
        {
          key: 'page-builder',
          label: 'Page Management',
          path: '/dashboard/manage-page'
        },
        {
          key: 'Home-Page-Manage',
          label: 'Theme Designer',
          path: '/dashboard/HomePageManagement'
        },
        {
          key: 'theme-designer',
          label: 'Theme Designer',
          path: '/dashboard/theme'
        }
      ]
    },
    {
      key: 'blog-manager',
      icon: <FileTextOutlined />,
      label: 'Blog Management',
      path: '/dashboard/blog'
    },
    {
      key: 'news-manager',
      icon: <FileTextOutlined />,
      label: 'News Management',
      path: '/dashboard/news'
    },
    {
      key: 'event-manager',
      icon: <FileTextOutlined />,
      label: 'Event Management',
      path: '/dashboard/events'
    },
    {
      key: 'employee-management',
      icon: <UserOutlined />,
      label: 'Employee Management',
      path: '/dashboard/employee-management'
    },
    {
      key: 'listings-services',
      icon: <AppstoreOutlined />,
      label: 'Listings & Services',
      children: [
        {
          key: 'all-listings',
          label: 'All Listings',
          path: '/dashboard/listings'
        },
        {
          key: 'service-catalog',
          label: 'Service Catalog',
          path: '/dashboard/services'
        }
      ]
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: 'Manage User',
      path: '/dashboard/users'
    },
    {
      key: 'system-settings',
      icon: <SettingOutlined />,
      label: 'System Settings',
      path: '/dashboard/settings'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: colorBgContainer,
          boxShadow: '2px 0 8px 0 rgba(29,35,41,.05)'
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
        }}>
          <h1 style={{ 
            color: '#1890ff', 
            margin: 0,
            fontSize: collapsed ? '20px' : '24px'
          }}>
            {collapsed ? 'KW' : 'KW Admin'}
          </h1>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
          items={menuItems}
          onClick={({ key, item }) => {
            if (key === 'logout' && item.props && item.props.onClick) {
              item.props.onClick();
            } else {
              const found = menuItems.find(i => i.key === key);
              if (found && found.path) navigate(found.path);
            }
          }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: 0, 
          background: colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '0 24px',
            height: '100%'
          }}>
            {collapsed ? (
              <MenuUnfoldOutlined 
                className="trigger" 
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '18px', cursor: 'pointer' }}
              />
            ) : (
              <MenuFoldOutlined 
                className="trigger" 
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '18px', cursor: 'pointer' }}
              />
            )}
          </div>
        </Header>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          minHeight: 280
        }}>
          {/* <Breadcrumbs /> */}
          <Outlet />
          <Footer />
        </Content>
      </Layout>
      <Customization />
    </Layout>
  );
} 