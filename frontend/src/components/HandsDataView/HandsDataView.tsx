// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// material
import { Box } from '@mui/material';

// temp
import JSONPretty from 'react-json-pretty';


const HandsDataView = ({ type, title, data, recordingName, state, onProgress, onSeek }: any) => {
  
  return (
    <AccordionView title='Hands Data' height={300}>
      <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'auto' }}>
        <JSONPretty id="json-pretty" data={data}></JSONPretty>
      </Box>
    </AccordionView>
  )
}

export default HandsDataView;