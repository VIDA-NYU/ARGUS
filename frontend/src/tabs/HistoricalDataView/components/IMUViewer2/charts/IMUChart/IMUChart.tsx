import { useEffect, useRef, useState } from 'react';

// controller
import { IMUChartController } from './controller/IMUChartController';

// styles
import './IMUChart.css'

const  IMUChart = ({ imudata, videostate, videometadata }: any) => {

    // DOM Refs
    const containerRef = useRef(null);

    // controller
    const [ imuchartcontroller, setimuchartcontroller ] = useState<IMUChartController>(null);

    // state
    const [ firstEntry, setFirstEntry ] = useState<number>(null);

    useEffect( () => {

        const imuChartController: IMUChartController = new IMUChartController();
        imuChartController.initialize_chart( containerRef.current );
        setimuchartcontroller(imuChartController);

    }, [])

    useEffect( () => {

        if(videometadata){
            const firstEntry: number = parseInt(videometadata['first-entry'].split('-')[0]);
            setFirstEntry(firstEntry);
        }
        

    }, [videometadata] );
     
    useEffect( () => {

        if(videostate.playing){
            imuchartcontroller.move_time_axis( firstEntry, videostate.currentTime );
        }

    }, [videostate] );

    useEffect( () => {  

        if( imudata ){
        
            const timestamps: number[] = imudata.map( element => parseInt(element.timestamp) );
            imuchartcontroller.clear_chart();
            imuchartcontroller.render_line(imudata.map( element => element.data ), timestamps );
        }

    }, [imudata] );

    return(
        <div ref={containerRef} className='chart-container'></div>
    )

}

export default IMUChart;