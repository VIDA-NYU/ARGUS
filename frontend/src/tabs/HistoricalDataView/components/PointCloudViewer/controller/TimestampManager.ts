// third-party
import * as BinaryTree from 'd3-binarytree';

export class TimestampManager {

    public gaze_timestamp_tree_index!: BinaryTree;
    public gaze_timestamp_to_index!: { [timestamp: number]: number };

    constructor(){}

    public generate_gaze_timestamp_index( gazeTimestamps: number[] ): void{

        // creating binary tree
        const tree = BinaryTree.binarytree().x( (x) => x ) ;

        const timestampToIndex: { [timestamp: number]: number } = {}; 
        gazeTimestamps.forEach( ( timestamp: number, index: number ) => {

            timestampToIndex[timestamp] = index;
            tree.add( timestamp );

        });
        
        // saving ref
        this.gaze_timestamp_to_index = timestampToIndex;
        this.gaze_timestamp_tree_index = tree;

    }

    public get_gaze_timestamp_index( initialTimestamp: number, timestamp: number ): number {

        const currentTimestamp: number = initialTimestamp + (timestamp * 1000);
        const closestTimestamp: number = this.gaze_timestamp_tree_index.find( currentTimestamp );
        return this.gaze_timestamp_to_index[closestTimestamp];

    }

}