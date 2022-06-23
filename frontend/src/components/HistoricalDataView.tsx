import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { VideoCard } from './VideoCard';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function HistoricalDataView() {
    const cameras: string[] = ['Main Camera', 'Depth Camera', 'Grey Left-Left Camera', 'Grey Left-Front Camera', 'Grey Right-Front Camera', 'Grey Right-Right Camera'];
    const filesNames: string[] = ["1654650367994", "1654651729620", "1654707203953", "1654707308170", "1654707334339"];
    const [camera, setCamera] = React.useState('');
    const handleChange = (event: SelectChangeEvent) => {
        setCamera(event.target.value as string);
    };
  return (
      <div>
    <Box sx={{ flexGrow: 1 }}>
      <FormControl sx={{ m: 1, minWidth: 340 }} size="small">
        <InputLabel id="demo-simple-select-label">Select Data</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={camera}
          label="Select Data"
          onChange={handleChange}
        >
            {Array.from(Array(filesNames.length)).map((_, index) => (
                <MenuItem key={'menu-item-' + index} value={filesNames[index]}>{filesNames[index]}</MenuItem>
            ))}
        </Select>
      </FormControl>
    </Box>
         
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 12, md: 12 }}>
        {Array.from(Array(cameras.length)).map((_, index) => (
          <Grid key={index} item xs={2} sm={4} md={4}>
            <VideoCard title={cameras[index]} subtitle={"130 frames"}/>
            {index}
          </Grid>
        ))}
      </Grid>
    </Box>
    </div>
  );
}