// react imports
import React, { useEffect } from 'react';

// material imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

// API imports
import { useGetAllRecordingInfoNotoken  } from '../../api/rest';
import {getFilteredData, getHistogramFromObjects, getHistogramValues, getMinMaxData} from '../../utils/DataProcessing';

// types
import { DataPlot } from './types/types';

// styles
// import './styles/HistoricalDataView.css'
// third-party
import c3 from "c3";
import Grid from '@mui/material/Grid';
import BarChart from './BarChart';

import { red, grey, blue, blueGrey } from '@mui/material/colors';

export const Chart = ({result, title}) => {
  let durationStats = [];
  durationStats.push(title);
  result.forEach(q => {
    durationStats.push(q);
  });
  let name = "chart" + title;
  let namex = "#chart" + title;
  React.useEffect(() => {
    c3.generate({
      bindto: namex,
      data: {
        columns: [
          durationStats,
        ],
        type: "bar",
      },
    });
  }, []);
  return <div id={name} />;
};

  function valuetext(value: number) {
    return `${value}°C`;
  }

  export function Filters({dataMinMax, summaryDuration, summarySize, summaryStreaming, ...props }) {
    const [valueDuration, setValueDuration] = React.useState<number[]>([0, dataMinMax.duration_max]);
    const [valueSize, setValueSize] = React.useState<number[]>([0,dataMinMax.size_mb_max]);
    const [valueStreamings, setValueStreamings] = React.useState<number[]>([0,dataMinMax.size_mb_max]);


    const handleChangeDuration = (event: Event, newValue: number[]) => {
      // if (typeof newValue === 'number') {
        setValueDuration(newValue);
        props.onChangeDuration(newValue);
      // }
    };
    const handleChangeSize = (event: Event, newValue: number[]) => {
      // if (typeof newValue === 'number') {
        setValueSize(newValue);
        props.onChangeSize(newValue);
      // }
    };
    const handleChangeStreamings = (event: Event, newValue: number[]) => {
      // if (typeof newValue === 'number') {
        setValueStreamings(newValue);
        props.onChangeStreamings(newValue);
      // }
    };

    const [value, setValue] = React.useState<number[]>([20, 37]);

    const handleChange = (event: Event, newValue: number | number[]) => {
      setValue(newValue as number[]);
    };


    return (
      <Box sx={{ width: "95%" , marginTop: 2}}>
        <Grid container spacing={1}>
          <Grid style={{marginTop: '8px', marginLeft: '-32px', marginRight: "-10px"}} item xs={5}>
          <BarChart width={195} height={100} datas={summaryDuration} title={"Duration"}/>
            {/* <Chart result={summaryDuration} title={"duration"} /> */}
            <Slider
              style={{marginLeft: 20, marginTop: '-52px', marginBottom: '37px', paddingRight: "0px", marginRight: "-10px"}}
              // aria-label="Custom marks"
              value={valueDuration}
              // getAriaValueText={valuetext}
              step={60}
              valueLabelDisplay="auto"
              // marks={[
              //   {
              //     value: 0,
              //     label: '0sec',
              //   },
              //   {
              //     value: dataMinMax.duration_max,
              //     label: dataMinMax.duration_max + 'sec',
              //   },
              // ]}
              min={dataMinMax.duration_min}
              max={dataMinMax.duration_max}
              onChange={handleChangeDuration}
              sx={{
                width: 155,
                color: blueGrey[300],
                "& .MuiSlider-thumb": {
                  height: 15,
                  width: 15,
                  borderRadius: "12px"
                },
                "& .MuiSlider-track": {
                  height: 3
                },
                "& .MuiSlider-rail": {
                  // color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
                  // opacity: theme.palette.mode === "dark" ? undefined : 1,
                  height: 2
                }
              }}
            />
          </Grid>
          <Grid style={{marginTop: '8px', marginLeft: '60px'}} item xs={5}>
            {/* <Chart result={summarySize} title={"size"} /> */}
            <BarChart width={195} height={100} datas={summarySize} title={"Size"}/>
            <Slider
              style={{marginLeft: 20, marginTop: '-52px', marginBottom: '37px'}}
              // aria-label="Custom marks"
              value={valueSize}
              // getAriaValueText={valuetext}
              step={60}
              valueLabelDisplay="auto"
              // marks={[
              //   {
              //     value: 0,
              //     label: '0MB',
              //   },
              //   {
              //     value: dataMinMax.size_mb_max,
              //     label: dataMinMax.size_mb_max + 'MB',
              //   },
              // ]}
              min={dataMinMax.size_mb_min}
              max={dataMinMax.size_mb_max}
              onChange={handleChangeSize}
              sx={{
                width: 153,
                color: blueGrey[300],
                "& .MuiSlider-thumb": {
                  height: 15,
                  width: 15,
                  borderRadius: "12px"
                },
                "& .MuiSlider-track": {
                  height: 3
                },
                "& .MuiSlider-rail": {
                  // color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
                  // opacity: theme.palette.mode === "dark" ? undefined : 1,
                  height: 2
                }
              }}
            />
          </Grid>
          <Grid style={{marginTop: '5px', marginLeft: '-32px', marginRight: "-10px"}} item xs={5}>
            {/* <Chart result={summaryStreaming} title={"streamings"} /> */}
            <BarChart width={195} height={100} datas={summaryStreaming} title={"Streamings"}/>
            <Slider
              style={{marginLeft: 20, marginTop: '-52px', marginBottom: '37px', paddingRight: "0px", marginRight: "10px"}}
              // aria-label="Custom marks"
              value={valueStreamings}
              // getAriaValueText={valuetext}
              step={1}
              valueLabelDisplay="auto"
              // marks={[
              //   {
              //     value: 0,
              //     label: '0MB',
              //   },
              //   {
              //     value: dataMinMax.size_mb_max,
              //     label: dataMinMax.size_mb_max + 'MB',
              //   },
              // ]}
              min={dataMinMax.streams_min}
              max={dataMinMax.streams_max}
              onChange={handleChangeStreamings}
              sx={{
                width: 156,
                color: blueGrey[300],
                "& .MuiSlider-thumb": {
                  height: 15,
                  width: 15,
                  borderRadius: "12px"
                },
                "& .MuiSlider-track": {
                  height: 3
                },
                "& .MuiSlider-rail": {
                  // color: theme.palette.mode === "dark" ? "#bfbfbf" : "#d8d8d8",
                  // opacity: theme.palette.mode === "dark" ? undefined : 1,
                  height: 2
                }
              }}
            />
          </Grid>
        </Grid>
      </Box>
    );
  }

  interface TypeFilters {
    duration?: number,
    size?: number,
    streams?: number
  }

const SummaryView = ({...props}) => {

    const [appliedFilters, setAppliedFilters] = React.useState<TypeFilters>({});
    const {response: recordings} = useGetAllRecordingInfoNotoken();

    useEffect(() => {
      // If there is any filter applied, then applied them over the updated data
      const filteredDataByDuration = appliedFilters.duration ? getFilteredData(recordings, "duration_secs", appliedFilters.duration): recordings;
      const filteredDataBySize = appliedFilters.size ? getFilteredData(filteredDataByDuration, "size_mb", appliedFilters.size): recordings;
      recordings && props.updateRecordings(filteredDataBySize);
    }, [recordings]);
    
    const handleChangeDuration = (newValue) => {
      const filteredData = getFilteredData(recordings, "duration_secs", newValue);
      setAppliedFilters({...appliedFilters, duration: newValue});
      props.updateRecordings(filteredData);
    }
    const handleChangeSize = (newValue) => {
      const filteredData = getFilteredData(recordings, "size_mb", newValue);
      setAppliedFilters({...appliedFilters, size: newValue});
      props.updateRecordings(filteredData);
    }

    const handleChangeStreamings = (newValue) => {
      const filteredData = getFilteredData(recordings, "streams", newValue);
      setAppliedFilters({...appliedFilters, streams: newValue});
      props.updateRecordings(filteredData);
    }

    if (recordings) {

      let dataMinMax = getMinMaxData(recordings);
      let summaryDuration =  getHistogramValues(recordings, 30, "duration_secs");
      let summarySize =  getHistogramValues(recordings, 100, "size_mb");
      let summaryStreaming =  getHistogramFromObjects(recordings, 2, "streams");
      return (
        <>
        {recordings && <Typography color="text.secondary">  Filters:</Typography>}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Filters 
              dataMinMax={dataMinMax}
              summaryDuration={summaryDuration}
              summarySize={summarySize}
              summaryStreaming={summaryStreaming}
              onChangeDuration={handleChangeDuration}
              onChangeSize={handleChangeSize}
              onChangeStreamings={handleChangeStreamings}
              />
        </Box>
        </>
      )
    } else {
      return <></>;
    }
  };

export default SummaryView;
