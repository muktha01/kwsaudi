import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Grid, 
  Box, 
  Typography, 
  Paper, 
  useTheme, 
  useMediaQuery,
  alpha 
} from '@mui/material';
import {
  PeopleAlt as PeopleAltIcon,
  SupportAgent as SupportAgentIcon,
  Visibility as VisibilityIcon,
  Description as DescriptionIcon,
  Collections as CollectionsIcon,
  HelpOutline as HelpOutlineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  EmojiEvents as EmojiEventsIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  Apartment as ApartmentIcon
} from '@mui/icons-material';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.95
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const mobileItemVariants = {
  hidden: { 
    y: 20, 
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [jasminAgents, setJasminAgents] = useState(0);
  const [jeddahAgents, setJeddahAgents] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const requestBody = {};
        const res = await fetch(`${import.meta.env.VITE_API_URL}/listings/list/properties`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        const data = await res.json();
        setProperties(Array.isArray(data?.data) ? data.data : []);
        setTotalProperties(data?.pagination?.total_items || 0);
      } catch (error) {
        setProperties([]);
        setTotalProperties(0);
      }
      setLoading(false);
    };

    const fetchAgents = async () => {
      try {
        const queryParams = new URLSearchParams({ offset: 0, limit: 1000 }).toString();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/agents/kw/combined-data?${queryParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        // Find the orgs by type and count their agents (org.data is now an array)
        let jasmin = 0;
        let jeddah = 0;
        if (Array.isArray(data?.results)) {
          data.results.forEach((org) => {
            if (org.type === 'people_org_50449' && Array.isArray(org.data)) {
              jasmin = org.data.length;
            }
            if (org.type === 'people_org_2414288' && Array.isArray(org.data)) {
              jeddah = org.data.length;
            }
          });
        }
        setJasminAgents(jasmin);
        setJeddahAgents(jeddah);
      } catch (error) {
        setJasminAgents(0);
        setJeddahAgents(0);
      }
    };

    fetchProperties();
    fetchAgents();
  }, []);



  const StatCard = ({ icon: Icon, title, count, trend, trendValue, color }) => (
    <motion.div
      whileHover={!isMobile ? { y: -5 } : {}}
      whileTap={isMobile ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
      variants={isMobile ? mobileItemVariants : itemVariants}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5, md: 3, lg: 4 },
          height: '100%',
          minHeight: { xs: '140px', sm: '160px', md: '180px', lg: '200px' },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 1.5, sm: 2 },
          background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
          border: `1px solid ${alpha(color, 0.1)}`,
          transition: 'all 0.3s ease-in-out',
          cursor: isMobile ? 'pointer' : 'default',
          '&:hover': {
            boxShadow: !isMobile ? `0 8px 24px ${alpha(color, 0.15)}` : 'none',
            transform: !isMobile ? 'translateY(-2px)' : 'none',
          },
          '&:active': isMobile ? {
            transform: 'scale(0.98)',
          } : {}
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            mb: { xs: 1, sm: 1.5, md: 2 },
            gap: { xs: 1, sm: 2 }
          }}>
            <Box
              sx={{
                width: { xs: 36, sm: 44, md: 52, lg: 56 },
                height: { xs: 36, sm: 44, md: 52, lg: 56 },
                borderRadius: { xs: '10px', sm: '12px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${color} 0%, ${alpha(color, 0.8)} 100%)`,
                color: '#fff',
                flexShrink: 0
              }}
            >
              <Icon sx={{ fontSize: { xs: 20, sm: 24, md: 28, lg: 32 } }} />
            </Box>
            <Box sx={{ 
              flex: 1,
              minWidth: 0, // Prevents text overflow
              textAlign: { xs: 'left', sm: 'left' }
            }}>
              <Typography 
                variant="h6" 
                color="textSecondary" 
                sx={{ 
                  mb: { xs: 0.25, sm: 0.5 },
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.125rem' },
                  fontWeight: 500,
                  lineHeight: 1.2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: { xs: 'nowrap', sm: 'normal' }
                }}
              >
                {title}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.25rem' },
                  lineHeight: 1.1,
                  color: color
                }}
              >
                {count}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: { xs: -15, sm: -20 },
            right: { xs: -15, sm: -20 },
            width: { xs: 60, sm: 80, md: 100, lg: 120 },
            height: { xs: 60, sm: 80, md: 100, lg: 120 },
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(color, 0.08)} 0%, ${alpha(color, 0.03)} 100%)`,
            zIndex: 0
          }}
        />
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{ 
      p: { xs: 1, sm: 2, md: 3, lg: 4 },
      maxWidth: '100%',
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default
    }}>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4, lg: 5 },
            mb: { xs: 2, sm: 3, md: 4 },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 1.5, sm: 2 },
            background: 'rgb(206,32,39,255)',
            color: '#fff',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'rgb(206,32,39,255)',
              zIndex: 1
            }
          }}
        >
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2,
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between'
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  mb: { xs: 0.5, sm: 1 }, 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2.25rem', lg: '2.5rem' },
                  color: '#fff',
                  lineHeight: { xs: 1.3, sm: 1.2 }
                }}
              >
                Welcome Back, Admin!
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  opacity: 0.9, 
                  mb: { xs: 2, sm: 3 },
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem', lg: '1.375rem' },
                  color: '#fff',
                  maxWidth: { xs: '100%', md: '70%' },
                  lineHeight: 1.4
                }}
              >
                Here's what's happening with your website today.
              </Typography>
            </Box>
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center', 
              gap: 2,
              mt: { xs: 2, md: 0 }
            }}>
              {/* Add any action buttons or additional info here if needed */}
            </Box>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: { xs: -50, sm: -75, md: -100 },
              right: { xs: -50, sm: -75, md: -100 },
              width: { xs: 150, sm: 200, md: 250, lg: 300 },
              height: { xs: 150, sm: 200, md: 250, lg: 300 },
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              zIndex: 1
            }}
          />
        </Paper>
      </motion.div>

      {/* Stats Grid - First Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid 
          container 
          spacing={{ xs: 2, sm: 2, md: 3, lg: gridSpacing }} 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            px: { xs: 0, sm: 0 }
          }}
        >
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={HomeIcon}
              title="Total Properties"
              count={isLoading ? '...' : totalProperties}
              trend="up"
              trendValue="12"
              color={theme.palette.primary.main}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <StatCard
              icon={PersonIcon}
              title="Agents in Jasmin"
              count={isLoading ? '...' : jasminAgents}
              trend="up"
              trendValue="8"
              color={theme.palette.success.main}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <StatCard
              icon={ApartmentIcon}
              title="Agents in Jeddah"
              count={isLoading ? '...' : jeddahAgents}
              trend="up"
              trendValue="15"
              color={theme.palette.info.main}
            />
          </Grid>
        </Grid>
      </motion.div>

      {/* Stats Grid - Second Row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
          
          
      
    </motion.div>
    </Box>
  );
};

export default Dashboard;