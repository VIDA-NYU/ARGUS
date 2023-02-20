
// material
import {styled} from '@mui/material';
import {useEffect, useState} from "react";
// import ComponentTemplate from '../../../../templates/HistoricalViewComponentTemplate/ComponentTemplate';
import ComponentTemplate from '../../templates/HistoricalViewComponentTemplate/ComponentTemplate';

// local components
import IMUChart from './charts/IMUChart/IMUChart';

import { preprocessData, sampleArray  } from './utils/utils';

// styles
const ComponentContainer = styled("div")(({}) => ({
    display: "flex",
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
}))

const ChartContainer = styled("div")(({}) => ({
    display: 'flex',
    height: '80%',
    width: '30%'
}))


const IMUDataView = ({ data, videostate, videometadata }: any) => {

    // states
    const [imuaccelData, setimuaccelData] = useState(null);
    const [imuaGyroData, setimuaGyroData] = useState(null);
    const [imuMagData, setimuMagData] = useState(null);

    useEffect(() => {

        if( data && data.length > 0 ){

            let processedAccelData = preprocessData(data[0]);
            let processedGyroData = preprocessData(data[1]);
            let processedMagData = preprocessData(data[2]);

            // // setting state
            setimuaccelData( processedAccelData );
            setimuaGyroData( processedGyroData );
            setimuMagData( processedMagData );

        }

    }, [data] )

    return (

        <ComponentContainer>

            <ChartContainer>
                <ComponentTemplate title={'IMUAccel'}>
                    <IMUChart imudata={imuaccelData} videostate={videostate} videometadata={videometadata}></IMUChart>
                </ComponentTemplate>
            </ChartContainer>
            
            <ChartContainer>
                <ComponentTemplate title={'IMUGyro'}>
                    <IMUChart imudata={imuaGyroData} videostate={videostate} videometadata={videometadata}></IMUChart>
                </ComponentTemplate>
            </ChartContainer>

            <ChartContainer>
                <ComponentTemplate title={'IMUMag'}>
                    <IMUChart imudata={imuMagData} videostate={videostate} videometadata={videometadata}></IMUChart>
                </ComponentTemplate>
            </ChartContainer>

        </ComponentContainer>

    )
}

export default IMUDataView;