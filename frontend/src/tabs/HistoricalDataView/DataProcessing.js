import * as d3 from 'd3';

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

export const getMinMaxData = (array) => {
    return {
        "duration_min": 0,// d3.min(array, d => d.duration_secs), 
        "duration_max": d3.max(array, d => d.duration_secs), 
        "size_mb_min": d3.min(array, d => d.size_mb),
        "size_mb_max": d3.max(array, d => d.size_mb)
    };
}

export const getFilteredData = (data, key, rangeValues) => {
  let result = [];
  result = data.filter(function(d){
    return ((d[key] <= rangeValues)  );  // check if the number between lower and upper bound
  });
  return result;
}