
/** Scale a value linearly within a domain and range */
export function scaleLinear (value, domain, range) { // (value: number, domain: number[], range: number[]) {
    const domainDifference = domain[1] - domain[0];
    const rangeDifference = range[1] - range[0];

    const percentDomain = (value - domain[0]) / domainDifference;
    return percentDomain * rangeDifference + range[0];
}
// Return an array of arrays that contain timestamp ranges.
export function timestampRanges(playedTimes, timedData){
    let loca = 0;
    // array of arrays with consecutive duplicated values. Output: [[1,1,1,1], [2,2], [1,1], [3,3,3]]
    let duplicatedValues = [];
    playedTimes.map((q, i) => {
        const timestampI = timedData.timestamps[i];
        if(timedData.data[i] > 0){
            if(loca === 0 && duplicatedValues.length === 0){
                duplicatedValues.push([timestampI]);
            } else {
                if (timedData.data[i] === timedData.data[i-1]){
                    duplicatedValues[loca].push(timestampI);
                } else {
                    duplicatedValues.push([timestampI]);
                    loca = loca +1;
                }
            }
        }
    })
    // get first and last values of each array of duplicated values to get ranges.
    const rangesOfDuplicatedValues = duplicatedValues.map(d => [d[0],[...d].pop()]);
    return rangesOfDuplicatedValues;
}