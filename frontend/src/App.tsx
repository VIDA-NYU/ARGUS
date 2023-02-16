import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardTabs from './DashboardTabs';
import 'c3/c3.css';

export default function App() {
  return (
    <div className='main-wrapper'>
        <DashboardTabs />
    </div>
  );
}