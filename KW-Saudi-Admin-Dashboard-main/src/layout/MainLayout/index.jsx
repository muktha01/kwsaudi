import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, theme, Avatar, Badge, Space, Button, Tooltip, Dropdown } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeOutlined,
  RocketOutlined,
  AppstoreAddOutlined,
  PictureOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  ContactsOutlined,
  LinkOutlined,
  FilePdfOutlined,
  BarChartOutlined,
  GlobalOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
  BuildOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

// project imports
import Footer from './Footer';
import Customization from '../Customization';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  // All hooks at the top
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { admin, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    handlerDrawerOpen(!collapsed);
  }, [collapsed]);

  // Early return after all hooks
  if (menuMasterLoading) return <Loader />;

 const menuItems = [
  {
    key: 'dashboard',
    icon: <HomeOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Dashboard',
    path: '/dashboard/default'
  },
  { type: 'divider' },
  {
    key: 'seo-management',
    icon: <RocketOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'SEO Management',
    path: '/dashboard/seo'
  },
  {
    key: 'page-builder',
    icon: <AppstoreAddOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Page Management',
    path: '/dashboard/manage-page'
  },
  {
    key: 'homepagemanagement',
    icon: <PictureOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Home Page Management',
    path: '/dashboard/HomePageManagement'
  },
  {
    key: 'news-manager',
    icon: <FileTextOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'News Management',
    path: '/dashboard/news'
  },
  {
    key: 'event-manager',
    icon: <CalendarOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Event Management',
    path: '/dashboard/events'
  },
  {
    key: 'employee-management',
    icon: <TeamOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Employee Management',
    path: '/dashboard/employee-management'
  },
  {
    key: 'user-management',
    icon: <UserOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Manage User',
    path: '/dashboard/users'
  },
  // { type: 'divider' },
  {
    key: 'leads',
    icon: <ContactsOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Forms Data',
    path: '/Leads'
  },
  {
    key: 'links',
    icon: <LinkOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Agent Links',
    path: '/AgentLinks'
  },
  {
    key: 'pdf',
    icon: <FilePdfOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Download PDF',
    path: '/Downloadpdf'
  },
   {
    key: 'pdf2',
    icon: <FilePdfOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Download PDF-Arabic',
    path: '/Pdf-arabic'
  },
  {
    key: 'analytics',
    icon: <BarChartOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Google Analytics Management',
    path: '/dashboard/analytics'
  },
  {
    key: 'translation',
    icon: <GlobalOutlined style={{ fontSize: '20px', color: 'rgb(206,32,39,255)' }} />,
    label: 'Language Translation',
    path: '/dashboard/translations'
  },
];


  const handleMenuClick = ({ key }) => {
    const item = menuItems.find(item => item.key === key);
    
    if (item?.path) {
      navigate(item.path);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await logout();
    navigate('/pages/login');
  };

  // Profile dropdown menu
  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/dashboard/profile')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }} dir="ltr"> {/* Set direction to LTR here */}
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
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
        theme="light"
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          // background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
          background:'rgb(206,32,39,255)',
          padding: '0 24px'
        }}>
          <h1 style={{ 
            color: '#fff', 
            margin: 0,
            fontSize: collapsed ? '20px' : '24px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}>
            <BuildOutlined style={{ fontSize: '24px' }} />
            {collapsed ? 'KW' : 'KW Admin'}
          </h1>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[location.pathname]}
          defaultOpenKeys={['page-management', 'listings-services']}
          style={{ 
            borderRight: 0,
            padding: '16px 8px',
            fontSize: '15px'
          }}
          items={menuItems}
          onClick={handleMenuClick}
          theme="light"
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 280, transition: 'all 0.2s' }}>
        <Header style={{ 
          padding: '0 24px', 
          background: colorBgContainer,
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collapsed ? (
              <MenuUnfoldOutlined 
                className="trigger" 
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '18px', cursor: 'pointer', padding: '8px' }}
              />
            ) : (
              <MenuFoldOutlined 
                className="trigger" 
                onClick={() => setCollapsed(!collapsed)}
                style={{ fontSize: '18px', cursor: 'pointer', padding: '8px' }}
              />
            )}
            <div style={{ marginLeft: '24px' }}>
              <Tooltip title="Search">
                <Button 
                  type="text" 
                  icon={<SearchOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />} 
                />
              </Tooltip>
            </div>
          </div>
          <Space size="large">
            <Tooltip title="Notifications">
              <Badge count={5} size="small">
                <Button 
                  type="text" 
                  icon={<BellOutlined style={{ fontSize: '18px' }} />} 
                />
              </Badge>
            </Tooltip>
            <Dropdown
              menu={{ items: profileMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: 'pointer' }}>
                <Avatar 
                  style={{ 
                    // backgroundColor: '#1890ff',
                     background:'rgb(206,32,39,255)',
                    verticalAlign: 'middle'
                  }} 
                  size="small"
                >
                  {admin ? `${admin.firstName?.[0] || ''}${admin.lastName?.[0] || ''}`.toUpperCase() : 'A'}
                </Avatar>
                <span style={{ color: 'white' }}>
                  {admin ? `${admin.firstName} ${admin.lastName}` : 'Not logged in'}
                </span>
              </Space>
            </Dropdown>
          </Space>
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
