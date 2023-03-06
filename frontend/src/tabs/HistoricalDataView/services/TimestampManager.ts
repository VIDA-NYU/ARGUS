// third-party
import * as BinaryTree from 'd3-binarytree';
import * as d3 from 'd3';

export default class TimestampManager {


    // main stream information
    public static mainStreamExtent: number[] = [];
    public static mainStreamTimestamps: number[];

    // public gaze_timestamp_tree_index!: BinaryTree;
    // public gaze_timestamp_to_index!: { [timestamp: number]: number };

    // private timestampIndex!: BinaryTree;


    // public static get_instance(): TimestampManager {
    //     return this.timestampManagerInstance;
    // }

    public static initialize_main_stream( timestamps: number[] ): void {
        TimestampManager.mainStreamExtent = d3.extent(timestamps);
    }

    public static get_elapsed_time( timestamp: number ): number {

        /*
        *
        *   Get elapsed time since the beginning of the session in seconds
        * 
        */

            return (timestamp - TimestampManager.mainStreamExtent[0])/1000;

    }
    
    public static generate_base_timestamp_index( timestampList: number[] ): void {

        

    }



    // public singletontest(): void{
    //     console.log(this.test);
    // }

    // public generate_gaze_timestamp_index( gazeTimestamps: number[] ): void{

    //     // creating binary tree
    //     const tree = BinaryTree.binarytree().x( (x) => x ) ;

    //     const timestampToIndex: { [timestamp: number]: number } = {}; 
    //     gazeTimestamps.forEach( ( timestamp: number, index: number ) => {

    //         timestampToIndex[timestamp] = index;
    //         tree.add( timestamp );

    //     });
        
    //     // saving ref
    //     this.gaze_timestamp_to_index = timestampToIndex;
    //     this.gaze_timestamp_tree_index = tree;

    // }

    // public get_gaze_timestamp_index( initialTimestamp: number, timestamp: number ): number {

    //     const currentTimestamp: number = initialTimestamp + (timestamp * 1000);
    //     const closestTimestamp: number = this.gaze_timestamp_tree_index.find( currentTimestamp );
    //     return this.gaze_timestamp_to_index[closestTimestamp];

    // }

    // public get_imu_timestamp_index( initialTimestamp: number, timestamp: number ): number {

    //     const currentTimestamp: number = initialTimestamp + (timestamp * 1000);
    //     const closestTimestamp: number = this.gaze_timestamp_tree_index.find( currentTimestamp );
    //     return closestTimestamp;

    // }

}