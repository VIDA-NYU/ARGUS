import * as d3 from 'd3';
import { dataType } from '../api/types';

export const getHistogramValues = (data, interval, key) => {
    let result = [];
    result = data.reduce(function (r, a) {
          var slot = Math.floor((a[key] - 1) / interval);
          if (slot < 0) {slot = 0}; 
          (r[slot] = r[slot] || []).push(a);
          return r;
      }, []);
    let durationStats = [];
    result.forEach(q => {
      durationStats.push(q.length);
    });

  return durationStats;
}

export const getHistogramFromObjects = (data, interval, key) => {
  let result = [];
  result = data.reduce(function (r, a) {
        var slot = Math.floor((Object.keys(a[key]).length - 1) / interval);
        if (slot < 0) {slot = 0};
        (r[slot] = r[slot] || []).push(a);
        return r;
    }, []);
  let durationStats = [];
  result.forEach(q => {
    durationStats.push(q.length);
  });

return durationStats;
}

export const getMinMaxData = (array) => {
    return {
        "duration_min": 0,// d3.min(array, d => d.duration_secs), 
        "duration_max": d3.max(array, d => d.duration_secs), 
        "size_mb_min": 0,
        "size_mb_max": d3.max(array, d => d.size_mb),
        "streams_min": 0,
        "streams_max": d3.max(array, d => Object.keys(d.streams).length)
    };
}

export const getFilteredData = (data, key, rangeValues) => {
  let result = [];

  result = (key === "streams")
            ?
            data.filter(function(d){ return ((Object.keys(d.streams).length <= rangeValues[1] && Object.keys(d.streams).length >= rangeValues[0])  ); }) // for streamings: check if the number between lower and upper bound
            :
            data.filter(function(d){
              // console.log();
              return ((d[key] <= rangeValues[1] && d[key] >= rangeValues[0])  );  // check if the number between lower and upper bound
            });
  return result;
}