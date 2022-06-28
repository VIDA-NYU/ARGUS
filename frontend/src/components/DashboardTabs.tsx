import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import HistoricalDataView from './HistoricalDataView';
import LiveDataView from './LiveDataView';
import RecipesView from './RecipesView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function DashboardTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ pt: 9, pl: 1,  width: '100%' }} component="main">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Live Data" {...a11yProps(0)} />
          <Tab label="Historical Data" {...a11yProps(1)} />
          <Tab label="Recipe Collection" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <LiveDataView />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <HistoricalDataView />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RecipesView />
      </TabPanel>
    </Box>
  );
}