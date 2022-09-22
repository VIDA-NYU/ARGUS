import { Utils } from './Utils';

export class Transformations {

    // normalizes data between -1 and 1
    public static generate_point_position_array( data: any, attributeName: string = 'GazeOrigin' ): {positions: any, colors: any } {

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

        const positions = new Float32Array(dataPoints.length * 3);
        const colors = new Float32Array(dataPoints.length * 3);
        let dst = 0;
        let cst = 0;
        dataPoints.forEach((d, i) => {

            const vector = dataPoints[i];
            positions[dst++] = Utils.scaleLinear(vector[0], xExtent, xScale);
            positions[dst++] = -24;
            positions[dst++] = Utils.scaleLinear(vector[2]!, zExtent, zScale);

            // colors
            colors[cst++] = 255;
            colors[cst++] = 0;
            colors[cst++] = 0;
        });

        return {positions, colors};
    } 
}