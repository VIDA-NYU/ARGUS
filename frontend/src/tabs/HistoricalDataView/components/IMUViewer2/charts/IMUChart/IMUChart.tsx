import { useEffect, useRef, useState } from 'react';

// controller
import { IMUChartController } from './controller/IMUChartController';

// styles
import './IMUChart.css'

const IMUChart = ({ imudata }: any) => {

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
            imuchartcontroller.render_line([10,20,30,40,50,60,70,80,90,100,10,20,30,40,50,60,70,80,90,100]);
        }

    }, [imudata] );

    return(
        <div ref={containerRef} className='chart-container'></div>
    )

}

export default IMUChart;