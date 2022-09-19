import { useEffect, useRef } from "react";
import Box from '@mui/material/Box';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const useDeque = (data, maxLen) => {
    const dataRef = useRef([]);
    useEffect(() => { data != null && dataRef.current.push(data) }, [data])
    useEffect(() => {
        while(maxLen && dataRef.current.length > maxLen) {
            dataRef.current.shift();
        }
    }, [data, maxLen])
    return dataRef.current;
}

export const DeticHandsChart = ({ data, maxLen=100, height=100 }) => {
    const overTime = useDeque(data, maxLen);

    return (
        <Box sx={{ minHeight: '60px' }}>
            <ResponsiveContainer width="100%" height={height}>
            <LineChart width={500} height={300} data={overTime}>
                <XAxis dataKey="time" tickCount={2} domain={['dataMin', 'dataMax']} tickFormatter={t => ((Date.now() - t)/1000).toFixed(1)} />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Line type="monotone" dataKey='mean_conf_smooth' stroke="#8884d8" />
            </LineChart>
            </ResponsiveContainer>
        </Box>
      );
}
export {}