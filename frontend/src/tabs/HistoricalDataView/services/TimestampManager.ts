// third-party
import * as BinaryTree from 'd3-binarytree';
import * as d3 from 'd3';

export default class TimestampManager {

    // main stream information
    public static mainStreamExtent: number[] = [];
    public static mainStreamTimestamps: number[];

    public static indexedTimestamps: { [streamName: string]: BinaryTree } = {}

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
    
    public static index_stream_timestamp( streamName: string, streamTimestamps: number[] ): void {

        // creating binary tree
        const timestampIndex: BinaryTree = BinaryTree.binarytree().x( (x) => x );
        timestampIndex.addAll( streamTimestamps );

        // saving stream index
        TimestampManager.indexedTimestamps[streamName] = timestampIndex;
        
    }

    public static get_closest_timestamp( streamName: string, timestamp: number ): number {

        const indexTree: BinaryTree = TimestampManager.indexedTimestamps[streamName];
        const closestTimestamp: number = indexTree.find( timestamp );

        return closestTimestamp;

    }

}