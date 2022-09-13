// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// custom components
import { AudioCard } from './AudioCard/AudioCard';

// api
import { getAudioPath } from '../../api/rest';


const AudioDataView = ({ type, title, data, recordingName, state, onProgress, onSeek }: any) => {
  
  return (
    <AccordionView title='Audio' height={100}>
      <AudioCard state={state} onSeek={res => onSeek(res)} onProgress={(res) => onProgress(res)} path={getAudioPath(recordingName)} />
    </AccordionView>
  )
}

export default AudioDataView;