import { LineCloud } from "../LineCloud";

export class ObjectGazeDistanceLineCloud extends LineCloud {

    constructor(public name: string, public origins: number[][], public destinations: number[][], public colors: number[][], public timestamps: number[]){

        super( name, origins, destinations, colors, timestamps );

    }

}