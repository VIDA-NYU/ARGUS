// material
import {Box, styled} from '@mui/material';

// react
import { useState, useEffect, useRef } from 'react';

// services
import { EventsManager } from '../../tabs/HistoricalDataView/services/EventsManager';

// local
import {computeIMUActivity, preprocessData, preprocessDataNew, sampleArray} from "./visualization/utils";
import IMUActivityLineChart from "./visualization/IMU-line-chart";
import {isEmpty} from "./visualization/utils";

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


const IMUChartViewer = ({ data, videostate, videometadata }: any) => {

    let processedAccelData = preprocessDataNew(data[0]);
    let processedGyroData = preprocessDataNew(data[1]);
    let processedMagData = preprocessDataNew(data[2]);

    console.log("imuaccelData");
    console.log(processedAccelData);

    console.log("imugyroData");
    console.log(processedGyroData);

    console.log("imuMagData");
    console.log(processedMagData);

    return (

        <ComponentContainer>

            <ChartContainer>
            <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <IMUActivityLineChart data={processedAccelData} measure={"Acceleration"} units={"m/s2"}></IMUActivityLineChart>
                </Box>
            </ChartContainer>
            
            <ChartContainer>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <IMUActivityLineChart data={processedGyroData} measure={"Angular Velocity"} units={"deg/s"}></IMUActivityLineChart>
                </Box>
            </ChartContainer>

            <ChartContainer>
                <Box sx={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <IMUActivityLineChart data={processedMagData} measure={"Magnetic Force"} units={"µT"}></IMUActivityLineChart>
                </Box>
            </ChartContainer>

        </ComponentContainer>

    )
}

export default IMUChartViewer;