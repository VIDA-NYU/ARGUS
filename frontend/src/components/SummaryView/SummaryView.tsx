// react imports
import React, { useEffect } from 'react';

// material imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

// API imports
import { useGetAllRecordingInfoNotoken  } from '../../api/rest';
import {getFilteredData, getHistogramFromObjects, getHistogramValues, getMinMaxData} from '../../utils/DataProcessing';

// styles
// import './styles/HistoricalDataView.css'
import * as d3 from 'd3'

// third-party
import c3 from "c3";
import Grid from '@mui/material/Grid';


interface dataPlot {
  label: string,
  totalCount: number
}

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


export function myHorizontalBarChart(data: dataPlot[], {
  marginTop = 20, // the top margin, in pixels
  marginRight = 10, // the right margin, in pixels
  marginBottom = 45, // the bottom margin, in pixels
  marginLeft = 75, // the left margin, in pixels
  totalWidth = 640, // the outer width of the chart, in pixels
  totalHeight = 400, // the outer height of the chart, in pixels
  yLabel = 'ylabel', // a label for the y-axis
  xLabel = 'xlabel',
  color = "steelblue", // bar fill color
  title = "title"
} = {}) {
  const margin = ({top: marginTop, bottom: marginBottom, left: marginLeft, right: marginRight});
  const visWidth = totalWidth - margin.left - margin.right;
  const visHeight = totalHeight - margin.top - margin.bottom;

  const categories = data.map(d => d.label);
  const yScale = d3.scaleBand()
    .domain(categories)
    .range([0, visHeight])
    .padding(0.2);
  
  const maxDurationHour = d3.max(data, d => d.totalCount);
  const xScale = d3.scaleLinear()
    .domain([0, maxDurationHour])
    .range([0, visWidth]);

  const format = d3.format('~s');
  const xAxis = d3.axisBottom(xScale).tickFormat(format);
  const yAxis = d3.axisLeft(yScale);
  
  // create and select an svg element that is the size of the bars plus margins 
  const svg = d3.create('svg')
      .attr('width', totalWidth)
      // we could also put visHeight + margin.top + margin.bottom instead of totalHeight
      .attr('height', totalHeight);
  
  // append a group element and move it left and down to create space
  // for the left and top margins
  const g = svg.append("g")
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
  // bind our data to rectangles
  g.selectAll('rect')
    .data(data)
    .join('rect')
      // set attributes for each bar
      .attr('x', 0) // each bar starts at the same x position
      .attr('y', d => yScale(d.label)) // pass the name to the y-scale to get y position
      .attr('width', d => xScale(d.totalCount)) // pass the score to the x-scale to get width of the bar
      .attr('height', yScale.bandwidth()) // get the width of each band in the scale
      .attr('fill', color);
  
  // add a group for the y-axis
  g.append('g')
      .call(yAxis)
      // remove the baseline
      .call(g => g.select('.domain').remove())
    .append('text')
      .attr("transform", "rotate(-90)")
      .attr('fill', 'black')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px')
      .attr('x', (-visHeight/2 + 40))
      .attr('y', (-marginLeft + 35))//-120 )
      .text(yLabel); ;
  
  // add a group for the x-axis
  g.append('g')
      // we have to move this group down to the bottom of the vis
      .attr('transform', `translate(0, ${visHeight})`)
      .call(xAxis)
      .call(g => g.select('.domain').remove())
    // add a label for the x-axis
    .append('text')
      .attr('fill', 'black')
      .attr('font-family', 'sans-serif')
      .attr('font-weight', 'bold')
      .attr('font-size', '11px')
      .attr('x', visWidth / 2)
      .attr('y', 40)
      .text(xLabel);
  
  // add chart's title
  if(title !== undefined) {
    svg.append("text")
     .attr("x", visWidth/2)
     .attr("y", marginTop/2)
     .attr("text-anchor", "middle")
     .style("font-size", "16px")
     .text(title);
  }
  return svg.node();
}

  function valuetext(value: number) {
    return `${value}°C`;
  }

  export function Filters({dataMinMax, summaryDuration, summarySize, summaryStreaming, ...props }) {
    const [valueDuration, setValueDuration] = React.useState<number>(dataMinMax.duration_max);
    const [valueSize, setValueSize] = React.useState<number>(dataMinMax.size_mb_max);
    const [valueStreamings, setValueStreamings] = React.useState<number>(dataMinMax.size_mb_max);


    const handleChangeDuration = (event: Event, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        setValueDuration(newValue);
        props.onChangeDuration(newValue);
      }
    };
    const handleChangeSize = (event: Event, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        setValueSize(newValue);
        props.onChangeSize(newValue);
      }
    };
    const handleChangeStreamings = (event: Event, newValue: number | number[]) => {
      if (typeof newValue === 'number') {
        setValueStreamings(newValue);
        props.onChangeStreamings(newValue);
      }
    };

    return (
      <Box sx={{ width: "95%" }}>
        <Grid container spacing={1}>
          <Grid style={{marginTop: '-10px', marginLeft: '-20px'}} item xs={6}>
            <Chart result={summaryDuration} title={"duration"} />
            <Slider
              style={{marginTop: '-30px', marginBottom: '20px'}}
              aria-label="Custom marks"
              value={valueDuration}
              getAriaValueText={valuetext}
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
            />
          </Grid>
          <Grid style={{marginTop: '-10px', marginLeft: '15px'}} item xs={6}>
            <Chart result={summarySize} title={"size"} />
            <Slider
              style={{marginTop: '-30px', marginBottom: '20px'}}
              aria-label="Custom marks"
              value={valueSize}
              getAriaValueText={valuetext}
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
            />
          </Grid>
          <Grid style={{marginTop: '-40px', marginLeft: '-20px'}} item xs={6}>
            <Chart result={summaryStreaming} title={"streamings"} />
            <Slider
              style={{marginTop: '-30px', marginBottom: '20px'}}
              aria-label="Custom marks"
              value={valueStreamings}
              getAriaValueText={valuetext}
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
      console.log(filteredDataBySize);
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
