
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

    // constants
    const Activity_Sample_Rate = 30;

    useEffect(() => {

        if( data && data.length > 0){


            let processedAccelData = preprocessData(data[0], recordingName);
            let processedGyroData = preprocessData(data[1], recordingName);
            let processedMagData = preprocessData(data[2], recordingName);
            // console.log("processedAccelData:")
            // console.log(processedAccelData)

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