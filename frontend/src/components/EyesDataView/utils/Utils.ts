export class Utils {

    constructor(){}

    // normalizes data between -1 and 1
    public static generate_point_position_array( data: any, attributeName: string = 'GazeOrigin' ): 
        {   positions: number[], 
            // positions: Float32Array, 
            extents: { [dimension: string]: number[] },
            scales: { [dimension: string]: number[] } } {

        // TODO: add this as a parameter to this function
        const currentAttribute: string = attributeName;

        const dataPoints: number[][] = [];
        data.forEach( (point: any, index: number) => {

            if( index % 4 === 0){
                const current3DPoint: number[] = [ point[currentAttribute].x, point[currentAttribute].y, point[currentAttribute].z ];
                dataPoints.push(current3DPoint);
            }
           
        });

        let xExtent = [0, 0];
        let yExtent = [0, 0];
        let zExtent = [0, 0];

        // Determine max and min of each axis of our data.
        xExtent = Utils.extent(dataPoints.map(p => p[0]));
        yExtent = Utils.extent(dataPoints.map(p => p[1]));
        zExtent = Utils.extent(dataPoints.map(p => p[2]!));

        const getRange = (extent: number[]) => Math.abs(extent[1] - extent[0]);
        const xRange = getRange(xExtent);
        const yRange = getRange(yExtent);
        const zRange = getRange(zExtent);
        const maxRange = Math.max(xRange, yRange, zRange);

        const halfCube = 50 / 2;
        const makeScaleRange = (range: number, base: number) => [
            -base * (range / maxRange),
            base * (range / maxRange),
        ];

     
        const xScale = makeScaleRange(xRange, halfCube);
        const yScale = makeScaleRange(yRange, halfCube);
        const zScale = makeScaleRange(zRange, halfCube);

        // const positions = new Float32Array(dataPoints.length * 3);
        const positions: number[] = [];
        let dst = 0;
        dataPoints.forEach((d, i) => {

            const vector = dataPoints[i];
            positions[dst++] = Utils.scaleLinear(vector[0], xExtent, xScale);
            positions[dst++] = Utils.scaleLinear(vector[1], yExtent, yScale);
            positions[dst++] = Utils.scaleLinear(vector[2], zExtent, zScale);

            // positions[dst++] = vector[0];
            // positions[dst++] = vector[1];
            // positions[dst++] = vector[2];

        });

        return { positions, extents: { x: xExtent, y: yExtent, z: zExtent }, scales: { x: xScale, y: yScale, z: zScale} };
    } 


    /** Compute the extent [minimum, maximum] of an array of numbers. */
    public static extent(data: number[]) {

        let minimum = Infinity;
        let maximum = -Infinity;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item < minimum) minimum = item;
            if (item > maximum) maximum = item;
        }
        return [minimum, maximum];
    }

    /** Scale a value linearly within a domain and range */
    public static scaleLinear(value: number, domain: number[], range: number[]) {
        const domainDifference = domain[1] - domain[0];
        const rangeDifference = range[1] - range[0];

        const percentDomain = (value - domain[0]) / domainDifference;
        return percentDomain * rangeDifference + range[0];
    }

}