// react imports
import React, { useState } from 'react';

// material imports
import Box from '@mui/material/Box';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Skeleton from '@mui/material/Skeleton';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

const SeeMoreStack = ({ children, label=null, limit=4, defaultCollapsed=true }) => {
    const [ collapsed, setCollapsed ] = useState(defaultCollapsed)
    children = children || [];
    const nMore = Math.max(children.length - limit, 0);
    return <Box my={0.1}>
      {label && <small><i>{label} </i></small>}
      {nMore ? (
            <small style={{ cursor: 'pointer' }} onClick={() => setCollapsed(!collapsed)}>
              <i>{collapsed ? `See ${nMore} more` : 'hide'}</i>
            </small> 
        ) : null}
      <Stack direction="row" spacing={1} flexWrap='wrap'>
        {collapsed && nMore ? children.slice(0, limit) : children}
      </Stack>
    </Box>
  }
  
const RecordingCard = (props) => {
    let { recording, onClick=null } = props;
    const files = recording?.files || [];

    const handleChange = (value) => {
        // Here, we invoke the callback with the new value
        props.onChange(value);
    }

    return (
      <Card sx={{ maxWidth: '98%', display: 'flex', flexDirection: 'column' }}>
        {/* <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
        /> */}
        <CardContent sx={{ flexGrow: 1, px: 2, py: 0.5, pt: 0.2 }}>
          <Button variant="outlined" onClick={() => handleChange(recording.name) } > 
            {recording.name}
            <ArrowForwardIosIcon />
          </Button>
  
          <Typography variant="h6" color="text.secondary">
            <b>{(recording.duration||'').split('.')[0]}s</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recording['first-entry-time']}
          </Typography>
  
          <SeeMoreStack label='Recorded streams:'>
            {Object.entries(recording.streams||{}).map(([sid, d]) => {
              const f = files.find(f=>f.startsWith(sid));
              return <Tooltip title={f||''} key={sid}>
                <Chip label={sid} size='small' color={f ? 'primary' : 'default'} />
              </Tooltip>
            })}
          </SeeMoreStack>
          <SeeMoreStack label='Available files:'>
            {recording.files?.map(f => <Chip key={f} label={f} size='small' />)}
          </SeeMoreStack>
        </CardContent>
        {/* <CardActions>
          <Button size="small" onClick={() => navigate(`/recordings/${recording.name}`)}>View</Button>
        </CardActions> */}
      </Card>
    );
  }

const ListView = ({ sortby='first-entry', ...props }) => {
    const { recordings } = props;
    const [value, setValue] = React.useState("");
    const handleChange = (newValue) => {
      console.log("newValue");  
      console.log(newValue);
      setValue(newValue);
      props.onChange(newValue);
    }

    return (
      // display='flex' flexWrap='wrap' gap={2} mt={5} m={'2em'} justifyContent='center'
        <Box display='flex' flexWrap='wrap' gap={2} pt={2} flexDirection='column'>
          {recordings && recordings
            .filter(d=>d.duration && !d.duration.startsWith('0:00:0'))
            .sort((a, b) => (a[sortby]||'').localeCompare(b[sortby]||''))
            .map((recording) => <RecordingCard recording={recording} key={recording.name} onChange={handleChange} {...props} />
            )
          || (Array.from({length: 6}, (x, i) => i).map(i => <Skeleton variant="rectangular" width={300} height={220} key={i} />))
          }
        </Box>
    )
  }

export default ListView;