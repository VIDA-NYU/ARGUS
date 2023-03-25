import React, { useEffect } from 'react';

// material
import { Box } from '@mui/system';
import { Slider } from '@mui/material';

const TimestampRangeSelector = ( props ) => {

    const [ selectedRange, setSelectedRange ] = React.useState<number[]>(props.timestampRange);

    useEffect( () => { setSelectedRange(props.timestampRange) }, [props] );

    const handleChange = (event: Event, newValue: number | number[]) => {
        setSelectedRange(newValue as number[]);
    };

    const changeCommited = (event: Event, newValue: number | number[]) => {

        props.onTimestampRangeCommited( selectedRange );

    };

    return(
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
            <Slider
                min={props.timestampRange[0]}
                max={props.timestampRange[1]}
                onChangeCommitted={changeCommited}
                onChange={handleChange}
                value={selectedRange}
                valueLabelDisplay="auto"/>
        </Box>
    )

}

export default TimestampRangeSelector;