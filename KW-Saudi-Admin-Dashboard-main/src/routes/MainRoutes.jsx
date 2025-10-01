import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ErrorBoundary from './ErrorBoundary';

// import BannerDetails from '../views/dashboard/BannerDetails';
// import BlogManagement from 'views/dashboard/BlogManagement';
import NewsManagement from 'views/dashboard/NewsManagement';
import EventManagement from 'views/dashboard/EventManagement';
import UserManagement from 'views/dashboard/UserManagement';
import AgentManagement from 'views/dashboard/AgentManagement';
import PageManagement from 'views/dashboard/PageManagement/PageManagement';
// import Banners from 'views/dashboard/Banners';
import Leads from 'views/pages/Contacts';
import Appointment from '../views/pages/Appointment';
import InstantValuation from '../views/pages/InstantValuation';
import JoinUs from '../views/pages/JoinUs';
import TeamManagement from '../views/pages/TeamManagement';
import EmployeeManagement from 'views/dashboard/EmployeeManagement'
import Profile from 'views/dashboard/Profile'
import AgentLinks from 'views/dashboard/AgentLinks'
import Downloadpdf from 'views/dashboard/Downloadpdf'
import DownloadpdfArabic from 'views/dashboard/Pdf-arabic'
import ApiManagement from 'views/dashboard/ApiManagement';
import TranslationManagement from 'views/dashboard/TranslationManagement';
// import HomePageManagement from 'views/dashboard/HomePageManagement'
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const SeoManagement = Loadable(lazy(() => import('views/dashboard/SeoManagement')));
const HomePageManagement = Loadable(lazy(() => import('views/dashboard/HomePageManagement')));


// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));





// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/pages/login" replace />;
  }
  
  return children;
};

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  errorElement: <ErrorBoundary />,
  children: [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <DashboardDefault />
        </ProtectedRoute>
      )
    },

    
    
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: (
            <ProtectedRoute>
              <DashboardDefault />
            </ProtectedRoute>
          )
        },
        {
          path: 'seo',
          element: (
            <ProtectedRoute>
              <SeoManagement/>
            </ProtectedRoute>
          )
        },
         {
          path: 'analytics',
          element: (
            <ProtectedRoute>
              <ApiManagement/>
            </ProtectedRoute>
          )
        },
        {
          path: 'homepageManagement',
          element: (
            <ProtectedRoute>
              <HomePageManagement/>
            </ProtectedRoute>
          )
        },
        // {
        //   path: 'blog',
        //   element: (
        //     <ProtectedRoute>
        //       <BlogManagement />
        //     </ProtectedRoute>
        //   )
        // },
        {
          path: 'news',
          element: (
            <ProtectedRoute>
              <NewsManagement />
            </ProtectedRoute>
          )
        },
        {
          path: 'events',
          element: (
            <ProtectedRoute>
              <EventManagement />
            </ProtectedRoute>
          )
        },

        {
          path: 'employee-management',
          element: (
            <ProtectedRoute>
              <EmployeeManagement />
            </ProtectedRoute>
          )
        },
        // {
        //   path: 'banners',
        //   element: (
        //     <ProtectedRoute>
        //       <Banners />
        //     </ProtectedRoute>
        //   )
        // },
        {
          path: 'users',
          element: (
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          )
        },
        {
          path: 'agents',
          element: (
            <ProtectedRoute>
              <AgentManagement />
            </ProtectedRoute>
          )
        },
        {
          path: 'manage-page',
          element: (
            <ProtectedRoute>
              <PageManagement />
            </ProtectedRoute>
          )
        },
        {
          path: 'appointment',
          element: (
            <ProtectedRoute>
              <Appointment />
            </ProtectedRoute>
          )
        },
        {
          path: 'instant-valuation',
          element: (
            <ProtectedRoute>
              <InstantValuation />
            </ProtectedRoute>
          )
        },
        {
          path: 'join-us',
          element: (
            <ProtectedRoute>
              <JoinUs />
            </ProtectedRoute>
          )
        },
        {
          path: 'team-management',
          element: (
            <ProtectedRoute>
              <TeamManagement />
            </ProtectedRoute>
          )
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          )
        },
        {
          path: 'translations',
          element: (
            <ProtectedRoute>
              <TranslationManagement />
            </ProtectedRoute>
          )
        },
      ]
    },
  
    // {
    //   path: '/add/admin',
    //   element: (
    //     <ProtectedRoute>
    //       <AddAdmin />
    //     </ProtectedRoute>
    //   )
    // },
    // {
    //   path: '/banners/bannerdetails',
    //   element: (
    //     <ProtectedRoute>
    //       <BannerDetails />
    //     </ProtectedRoute>
    //   )
    // },
    // {
    //   path: '/all/admin',
    //   element: (
    //     <ProtectedRoute>
    //       <AlllAdmins />
    //     </ProtectedRoute>
    //   )
    // },
    {
      path: '/leads',
      element: (
        <ProtectedRoute>
          <Leads />
        </ProtectedRoute>
      )
    },
     {
      path: '/agentlinks',
      element: (
        <ProtectedRoute>
          <AgentLinks />
        </ProtectedRoute>
      )
    },
    {
      path: '/downloadpdf',
      element: (
        <ProtectedRoute>
          <Downloadpdf />
        </ProtectedRoute>
      )
    },
    {
      path: '/Pdf-arabic',
      element: (
        <ProtectedRoute>
          <DownloadpdfArabic />
        </ProtectedRoute>
      )
    },
    {
      path: '/appointment',
      element: (
        <ProtectedRoute>
          <Appointment />
        </ProtectedRoute>
      )
    },
  
    // {
    //   path: 'typography',
    //   element: <UtilsTypography />
    // },
    // {
    //   path: 'color',
    //   element: <UtilsColor />
    // },
    // {
    //   path: 'shadow',
    //   element: <UtilsShadow />
    // },
    // {
    //   path: '/sample-page',
    //   element: <SamplePage />
    // }

     
  ]



};



export default MainRoutes;