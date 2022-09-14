import * as d3 from 'd3';

export class Transformations {

    // normalizes data between -1 and 1
    public static normalize_data( data: any ): number[] {

        const scaleX = d3.scaleLinear().domain(d3.extent(data,  element => {  return element.GazeOrigin.x} )).range([-50, 50]);
        const scaleY = d3.scaleLinear().domain(d3.extent(data,  element => {  return element.GazeOrigin.y} )).range([-50, 50]);
        const scaleZ = d3.scaleLinear().domain(d3.extent(data,  element => {  return element.GazeOrigin.z} )).range([-50, 50]);

        const normalized_data = [];
        data.forEach( element => {
            normalized_data.push(scaleX(element.GazeOrigin.x))
            normalized_data.push(scaleY(element.GazeOrigin.y))
            normalized_data.push(scaleZ(element.GazeOrigin.z))
        });

        return [0,0,0];
    } 
}