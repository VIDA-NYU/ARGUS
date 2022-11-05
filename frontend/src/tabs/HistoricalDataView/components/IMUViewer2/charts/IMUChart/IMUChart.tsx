import { useEffect, useRef, useState } from 'react';

// controller
import { IMUChartController } from './controller/IMUChartController';

// styles
import './IMUChart.css'

const  IMUChart = ({ imudata }: any) => {

    // DOM Refs
    const containerRef = useRef(null);

    // controller
    const [ imuchartcontroller, setimuchartcontroller ] = useState<IMUChartController>(null);

    useEffect( () => {

        const imuChartController: IMUChartController = new IMUChartController();
        imuChartController.initialize_chart( containerRef.current );
        setimuchartcontroller(imuChartController);

    }, [])
 
    useEffect( () => {  

        if( imudata ){
            imuchartcontroller.clear_chart();
            imuchartcontroller.render_line(imudata.map( element => element.data ));
        }

    }, [imudata] );

    return(
        <div ref={containerRef} className='chart-container'></div>
    )

}

export default IMUChart;