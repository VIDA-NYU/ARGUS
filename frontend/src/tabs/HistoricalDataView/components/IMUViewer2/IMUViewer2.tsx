
// material
import {styled} from '@mui/material';
import {useEffect, useState} from "react";

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


const IMUDataView = ({ data, recordingName }: any) => {

    // states
    const [imuaccelData, setimuaccelData] = useState(null);
    const [imuaGyroData, setimuaGyroData] = useState(null);
    const [imuMagData, setimuMagData] = useState(null);

    useEffect(() => {

        console.log('incoming IMU data...', data);

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
                <IMUChart imudata={imuaccelData}></IMUChart>
                {/* <IMUActivityBarChart></IMUActivityBarChart> */}
                {/* data={imuaccelData} */}
            </ChartContainer>

            <ChartContainer>
                <IMUChart imudata={imuaGyroData}></IMUChart>
                {/* <IMUActivityBarChart data={imuaGyroData}></IMUActivityBarChart> */}
            </ChartContainer>

            <ChartContainer>
                <IMUChart imudata={imuMagData}></IMUChart>
                {/* <IMUActivityBarChart data={imuMagData}></IMUActivityBarChart> */}
            </ChartContainer>

        </ComponentContainer>

    )
}

export default IMUDataView;