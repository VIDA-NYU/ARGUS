import * as d3 from 'd3';
import * as THREE from 'three';

export class Transformations {

    // normalizes data between -1 and 1
    public static normalize_data( data: any ): {normalizedData: number[], colors: number[] } {

        // const max: number = d3.max( data, element => d3.max([element.GazeOrigin.x, element.GazeOrigin.y, element.GazeOrigin.z]));
        // const min: number = d3.min( data, element => d3.min([element.GazeOrigin.x, element.GazeOrigin.y, element.GazeOrigin.z]));
        // const scale: any = d3.scaleLinear().domain([min, max]).range([-25,25]);

        const scaleX = d3.scaleLinear().domain(d3.extent(data,  element => {  return element.GazeOrigin.x} )).range([-25, 25]);
        const scaleY = d3.scaleLinear().domain(d3.extent(data,  element => {  return element.GazeOrigin.y} )).range([-25, 25]);
        const scaleZ = d3.scaleLinear().domain(d3.extent(data,  element => {  return element.GazeOrigin.z} )).range([-25, 25]);

        const normalizedData = [];
        data.forEach( element => {
            normalizedData.push(scaleX(element.GazeOrigin.x));
            // normalizedData.push(scaleY(element.GazeOrigin.y));
            normalizedData.push(-24);
            normalizedData.push(scaleZ(element.GazeOrigin.z));
        });

        const colors = [];
        const color = new THREE.Color();
        data.forEach( element => {
            color.setRGB( 255, 0, 0 );
            colors.push( color.r, color.g, color.b );
        })

        return {normalizedData, colors};
    } 
}