import * as React from 'react';
import { Button } from '@mui/material';
import { VideoCard } from './VideoCard';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

export default function LiveDataView() {
  const [buttonvalue, setButton] = React.useState(false);
  const handleButtonChange = (newValue: boolean) => {
    setButton(newValue);
  };

  return (
    <div>
      <Button 
      startIcon={<VideocamOutlinedIcon />}
      onClick={() => {
        handleButtonChange(true);
      }}
      variant="contained">Start Recording</Button>
      <div style={{margin: 22}}
      ></div>
      <VideoCard title="Live Data" subtitle={""}/>
    </div>
  );
}