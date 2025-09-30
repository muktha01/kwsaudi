// routing
import router from 'routes';
import { RouterProvider } from 'react-router-dom';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';

// auth provider
import { AuthProvider } from './contexts/AuthContext';
// import { TranslationProvider } from './contexts/TranslationContext'; // Removed TranslationProvider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <AuthProvider>
      {/* <TranslationProvider> */}
        <ThemeCustomization>
          <NavigationScroll>
            <>
              <RouterProvider router={router} />
            </>
          </NavigationScroll>
        </ThemeCustomization>
      {/* </TranslationProvider> */}
    </AuthProvider>
  );
}
