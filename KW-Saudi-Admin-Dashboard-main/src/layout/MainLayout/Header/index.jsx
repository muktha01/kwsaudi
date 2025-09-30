// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { useTranslation } from '../../../contexts/TranslationContext';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { language, switchToLanguage } = useTranslation();

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          {/* <LogoSection /> */}

          <p>Admin Dashboard</p>
        </Box>

        <Avatar
  variant="rounded"
  sx={{
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    overflow: 'hidden',
    transition: 'all .2s ease-in-out',
    bgcolor: 'rgb(206,32,39,255)',   // 🔴 red background
    color: '#fff',                   // ✅ white icon
    '&:hover': {
      bgcolor: 'rgba(180, 28, 34, 1)', // 🔴 darker red on hover
      color: '#fff'
    }
  }}
  onClick={() => handlerDrawerOpen(!drawerOpen)}
  color="inherit"
>
  <IconMenu2 stroke={1.5} size="20px" />
</Avatar>

      </Box>

      {/* Language Switcher */}
      <Button variant="contained" onClick={() => switchToLanguage(language === 'en' ? 'ar' : 'en')}>
        {language === 'en' ? 'عربي' : 'English'}
      </Button>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* notification */}
      <NotificationSection />

      {/* profile */}
      <ProfileSection />
    </>
  );
}
