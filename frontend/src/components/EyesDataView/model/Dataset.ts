// utils
import { Utils } from "../utils/Utils";

// third-party
import * as BinaryTree from 'd3-binarytree';

// types
import { Vector3D } from './Scene';


interface TransformationUtils{

    extents: { [dimension: string]: number[] },
    scales: { [dimension: string]: number[] }

}

// this file contains objects that will be rendered on the scence
export class Dataset {

    // raw format incoming points
    public rawDataset: any[] = [];   

    // array of positions
    // public positions: Float32Array | null = null;
    // public positions: number[] | null = null;
    public positions: { originPositions: number[], directionPositions: number[] };

    // timestamp index
    public timestampToPoint: { [timestamp: number]: any } = {};

    // binary tree of timestamps
    public timestampTree: BinaryTree.binarytree;

    public extents: { originExtents: number[][], directionExtents: number[][] };
    // transformations params
    // public transformationParams: TransformationUtils;


    constructor( public recordingMetadata: any, dataset: any ){

        // initializing dataset
        this.initialize_dataset( dataset );

        // generating indexed timestamps
        this.generate_timestamp_index( dataset );

        // saving recording metadata
        this.recordingMetadata = recordingMetadata;
    }


    // public transform_point_to_cube_coords( point: Vector3D ): number[] {

    //     const positions: number[] = [
    //         Utils.scaleLinear(point.x, this.transformationParams.extents.x, this.transformationParams.scales.x ),
    //         Utils.scaleLinear(point.y, this.transformationParams.extents.y, this.transformationParams.scales.y ),
    //         Utils.scaleLinear(point.z, this.transformationParams.extents.z, this.transformationParams.scales.z ),
    //     ]

    //     return positions;

    // }

    public get_corresponding_point( timestamp: number ): any {

        return this.timestampToPoint[timestamp];

    }

    public get_corresponding_timestamp( timestamp: number ): number {

        const rawInitialTimestamp: string = this.recordingMetadata['first-entry'].split('-')[0]
        const currentTimestamp: number = Math.floor(parseInt(rawInitialTimestamp) + timestamp * 1000);
        return this.timestampTree.find( currentTimestamp );

    }

    private initialize_dataset( dataset: any ): void {

        // saving dataset ref
        this.rawDataset = dataset;

        // generating scene positions
        const extents: { originExtents: number[][], directionExtents: number[][]} = Utils.generate_cloud_extents( this.rawDataset );
        this.extents = extents;

        console.log(extents);

        // generating positions array
        const positions: { originPositions: number[], directionPositions: number[] } = Utils.generate_original_point_position_array( this.rawDataset );
        this.positions = positions;

        // const transformation = Utils.generate_point_position_array( dataset );
        // this.positions = transformation.positions;
        
        // // saving scales and extents
        // this.transformationParams = {
        //     extents: transformation.extents,
        //     scales: transformation.scales
        // };

    }

    private generate_timestamp_index( dataset: any[] ): void {

        // creating binary tree
        const tree = BinaryTree.binarytree().x( (x) => x ) ;

        const timestampToPoint: { [timestamp: number]: any } = {};
        dataset.forEach( (element: any ) => {

            const currentTimestamp: number = parseInt(element.timestamp.split('-')[0]);
            timestampToPoint[currentTimestamp] = {
                'GazeOrigin': element.GazeOrigin,
                'GazeDirection': element.GazeDirection
            };

            // adding current timestamp to the tree
            tree.add(currentTimestamp);
        })

        // saving ref
        this.timestampToPoint = timestampToPoint;
        this.timestampTree = tree;
    }


}