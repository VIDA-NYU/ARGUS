import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardTabs from './utils/DashboardTabs';
import 'c3/c3.css';

export default function App() {
  return (
    <div className="App">
        <Box sx={{ display: "flex" }}>
          <AppBar component="nav">
              <Toolbar>
              <IconButton
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ mr: 2 }}
              >
                  <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  TIM Dashboard
              </Typography>
              </Toolbar>
          </AppBar>
        </Box>
        <DashboardTabs />
    </div>
  );
}
//sx={{ flexGrow: 1 }}