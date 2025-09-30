import {
  IconLayoutDashboard,
  IconSeo,
  IconPalette,
  IconChevronDown,
  IconChevronRight,
  IconSettings,
  IconUser,
  IconArticle,
  IconListDetails,
  IconLogout,
  IconLanguage
} from '@tabler/icons-react';

const icons = {
  dashboard: IconLayoutDashboard,
  seo: IconSeo,
  palette: IconPalette,
  chevronDown: IconChevronDown,
  chevronRight: IconChevronRight,
  settings: IconSettings,
  user: IconUser,
  employee: IconUser,
  article: IconArticle,
  listing: IconListDetails,
  logout: IconLogout,
  language: IconLanguage
};

const pages = {
  id: 'admin-dashboard',
  title: 'Admin Console',
  type: 'group',
  children: [
    {
      id: 'manage-page',
      title: 'Page Management',
      type: 'collapse',
      icon: icons.dashboard,
      color: '#1976d2',
      children: [
        {
          id: 'seo-management',
          title: 'SEO Management',
          type: 'item',
          url: '/dashboard/seo',
          icon: icons.seo,
          color: '#43a047'
        },
        {
          id: 'page-builder',
          title: 'Page Management',
          type: 'item',
          url: '/dashboard/manage-page',
          icon: icons.dashboard,
          color: '#1976d2'
        },
        {
          id: 'theme-designer',
          title: 'Theme Designer',
          type: 'item',
          url: '/dashboard/theme',
          icon: icons.palette,
          color: '#ffb300'
        }
      ]
    },
    {
      id: 'blog-manager',
      title: 'Blog Management',
      type: 'item',
      url: '/dashboard/blog',
      icon: icons.article,
      color: '#8e24aa'
    },
    {
      id: 'employee-management',
      title: 'Employee Management',
      type: 'item',
      url: '/dashboard/employee-management',
      icon: icons.listing,
      color: '#00acc1'
    },
    {
      id: 'user-management',
      title: 'Manage User',
      type: 'item',
      url: '/dashboard/users',
      icon: icons.user,
      color: '#f44336'
    },
    //  {
    //   id: 'agent-management',
    //   title: 'Manage Agent',
    //   type: 'item',
    //   url: '/dashboard/Agents',
    //   icon: icons.user,
    //   color: '#f44336'
    // },
    {
      id: 'appointment',
      title: 'Appointment',
      type: 'item',
      url: '/appointment',
      icon: icons.listing,
      color: '#00acc1'
    },
    {
      id: 'team-management',
      title: 'Team Management',
      type: 'item',
      url: '/dashboard/team-management',
      icon: icons.listing,
      color: '#00acc1'
    },
    {
      id: 'instant-valuation',
      title: 'Instant Valuation',
      type: 'item',
      url: '/dashboard/instant-valuation',
      icon: icons.listing,
      color: '#00acc1'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      type: 'item',
      url: '/dashboard/settings',
      icon: icons.settings,
      color: '#ffa726'
    },
    {
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.logout,
      color: '#757575'
    },
    {
      id: 'join-us',
      title: 'Join Us',
      type: 'item',
      url: '/dashboard/join-us',
      icon: icons.listing,
      color: '#00acc1'
    },
    {
      id: 'api-management',
      title: 'API Management',
      type: 'item',
      url: '/dashboard/api',
      icon: icons.settings,
      color: '#1976d2'
    },
    {
      id: 'translation-management',
      title: 'Translation Management',
      type: 'item',
      url: '/dashboard/translations',
      icon: icons.language,
      color: '#00b0ff'
    }
  ]
};

export default pages;