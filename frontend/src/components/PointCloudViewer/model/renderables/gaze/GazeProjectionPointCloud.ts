import { Object3D } from "three";
import { Dataset } from "../../Dataset";
import { Raycaster } from "../../raycaster/Raycaster";
import { PointCloud } from "../PointCloud";

export class GazeProjectionPointCloud extends PointCloud {

    constructor(public name: string, public points: number[][], public colors: number[][], public normals: number[][], public timestamps: number[] ){

        // initializing super class
        super(name, points, colors, normals, timestamps);

    }

    public initialize_highlights(): void {
    }

    public highlight( raycaster: Raycaster, dataset: Dataset, intersects: any[] ): number {
        return -1
    }

    public offlight(): void {
    }

    public get_highlight_objects(): Object3D[] {
        return [];
    }
}