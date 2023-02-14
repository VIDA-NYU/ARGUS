import * as React from 'react';

// Material
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Tabs
import HistoricalDataView from './tabs/HistoricalDataView/HistoricalDataView3';
import LiveDataView from './tabs/LiveDataView/LiveDataView';
import DebuggingDataView from './tabs/DebuggingDataView/DebuggingDataView';
import WOZView from './tabs/IntervenorView/WOZView';
import RecipesView from './tabs/RecipesCollectionView/RecipesView';


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
      style={{ flex: 1 }}
    >
      {value === index && (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', p: 2 }}>
          <Typography component={'div'} style={{ display: 'flex', flex: 1 }}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function DashboardTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };  

  return (
    <Box sx={{ pt: 9, pl: 1,  width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }} component="main">

      <Box sx={{ width: '100%', height: '60px'}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" >
          <Tab label="Create Data" {...a11yProps(0)} />
          <Tab label="Historical Data" {...a11yProps(1)} />
          <Tab label="Recipe Collection" {...a11yProps(2)} />
          {/* <Tab label="Debuging Models" {...a11yProps(3)} /> */}
          {/* <Tab label="Intervenor" {...a11yProps(4)} />  */}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, display: 'flex' }}>

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

      
      {/* <TabPanel value={value} index={3}>
        <DebuggingDataView />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <WOZView />
      </TabPanel> */}
    </Box>
  );
}