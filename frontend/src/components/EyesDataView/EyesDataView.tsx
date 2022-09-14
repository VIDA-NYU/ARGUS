// templates
import AccordionView from '../../templates/AccordionView/AccordionView';

// material
import { Box } from '@mui/system';

// temp
import JSONPretty from 'react-json-pretty';
import { Transformations } from './utils/Transformations';

// react
import { useEffect, useRef, useState } from 'react';

// style
import './EyesDataView.css'

// model
import { Dataset } from './model/Dataset';
import { Scene } from './model/Scene';

interface EyesDataViewProps {
  points: any
}

const EyesDataView = ({ type, title, data, recordingMetadata, currentState }: any) => {

  // DOM Refs
  const containerRef = useRef(null);

  // let scene: Scene | null = null;
  const scene = useRef(null)
  const dataset = useRef(null);

  useEffect( () => {

    if( dataset.current ){

      // const gazePoint: any = 
      const timestamp: number = dataset.current.get_corresponding_timestamp( currentState.currentTime );
      
      // gaze point is of type {'origin': {x: number, 'y': number, 'z': number }, 'direction': {x: number, 'y': number, 'z': number }}
      const gazePoint: any = dataset.current.get_corresponding_point(timestamp);
      const gazePosition: number[] = dataset.current.transform_point_to_cube_coords(gazePoint.GazeOrigin);
      const gazeDirection: number[] = dataset.current.transform_point_to_cube_coords(gazePoint.GazeDirection);

      // highlighting gaze position
      scene.current.highlight_current_gaze_point( gazePosition, gazeDirection );
    }

  }, [currentState]) 

  useEffect( () => {

    // once data comes to the component, we update the scene
    if(data.length) {

      // creating dataset obj
      dataset.current = new Dataset( recordingMetadata, data );

      // initializing scene
      scene.current = new Scene();
      scene.current.init( containerRef );

      // adding helpers
      scene.current.add_scene_helpers( true );

      // adding orbit controls
      scene.current.add_orbit_controls();

      // adding gaze history
      scene.current.update_gaze_history( dataset.current.positions );

      // rendering scene
      scene.current.render();

    } 
    
  }, [data]);

  return (
    <AccordionView title='Eyes Data' height={600}>
        <Box sx={{ display: 'flex', width: '100%', height: '100%', overflow: 'auto' }}>
          <div style={{width: '1600px', height: '600px'}} ref={containerRef} id='scenecontainer'></div>
        </Box>
    </AccordionView>
  )
}

export default EyesDataView;