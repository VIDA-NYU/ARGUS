
/** Scale a value linearly within a domain and range */
export function scaleLinear (value, domain, range) { // (value: number, domain: number[], range: number[]) {
    const domainDifference = domain[1] - domain[0];
    const rangeDifference = range[1] - range[0];

    const percentDomain = (value - domain[0]) / domainDifference;
    return percentDomain * rangeDifference + range[0];
}
